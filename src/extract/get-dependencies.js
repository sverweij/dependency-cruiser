const path = require("path");
const _get = require("lodash/get");
const _uniqBy = require("lodash/uniqBy");
const { intersects } = require("../utl/array-util");
const resolve = require("./resolve");
const extractES6Deps = require("./ast-extractors/extract-es6-deps");
const extractCommonJSDeps = require("./ast-extractors/extract-cjs-deps");
const extractAMDDeps = require("./ast-extractors/extract-amd-deps");
const extractTypeScriptDeps = require("./ast-extractors/extract-typescript-deps");
const extractSwcDeps = require("./ast-extractors/extract-swc-deps");
const toJavascriptAST = require("./parse/to-javascript-ast");
const toTypescriptAST = require("./parse/to-typescript-ast");
const toSwcAST = require("./parse/to-swc-ast");
const detectPreCompilationNess = require("./utl/detect-pre-compilation-ness");
const extractModuleAttributes = require("./utl/extract-module-attributes");

function extractFromSwcAST(pOptions, pFileName) {
  return extractSwcDeps(
    toSwcAST.getASTCached(path.join(pOptions.baseDir, pFileName)),
    pOptions.exoticRequireStrings
  );
}

function extractFromTypeScriptAST(pOptions, pFileName) {
  return extractTypeScriptDeps(
    toTypescriptAST.getASTCached(path.join(pOptions.baseDir, pFileName)),
    pOptions.exoticRequireStrings
  );
}

function shouldUseTSC(pOptions, pFileName) {
  return (
    toTypescriptAST.isAvailable() &&
    path.extname(pFileName).startsWith(".ts") &&
    pOptions.tsPreCompilationDeps
  );
}

function isSwcAble(pFileName) {
  return [".ts", ".js", ".mjs", ".cjs"].includes(path.extname(pFileName));
}

function shouldUseSwc(pOptions, pFileName) {
  return (
    pOptions.parser === "swc" && toSwcAST.isAvailable() && isSwcAble(pFileName)
  );
}

function extractFromJavaScriptAST(pOptions, pFileName, pTranspileOptions) {
  let lDependencies = [];
  const lAST = toJavascriptAST.getASTCached(
    path.join(pOptions.baseDir, pFileName),
    pTranspileOptions
  );

  if (pOptions.moduleSystems.includes("cjs")) {
    extractCommonJSDeps(
      lAST,
      lDependencies,
      "cjs",
      pOptions.exoticRequireStrings
    );
  }
  if (pOptions.moduleSystems.includes("es6")) {
    extractES6Deps(lAST, lDependencies);
  }
  if (pOptions.moduleSystems.includes("amd")) {
    extractAMDDeps(lAST, lDependencies, pOptions.exoticRequireStrings);
  }

  return lDependencies;
}

function extractDependencies(pCruiseOptions, pFileName, pTranspileOptions) {
  let lDependencies = [];
  if (shouldUseSwc(pCruiseOptions, pFileName)) {
    lDependencies = extractFromSwcAST(
      pCruiseOptions,
      pFileName
    ).filter((pDep) =>
      pCruiseOptions.moduleSystems.includes(pDep.moduleSystem)
    );
  } else if (shouldUseTSC(pCruiseOptions, pFileName)) {
    lDependencies = extractFromTypeScriptAST(
      pCruiseOptions,
      pFileName
    ).filter((pDep) =>
      pCruiseOptions.moduleSystems.includes(pDep.moduleSystem)
    );

    if (pCruiseOptions.tsPreCompilationDeps === "specify") {
      lDependencies = detectPreCompilationNess(
        lDependencies,
        extractFromJavaScriptAST(pCruiseOptions, pFileName, pTranspileOptions)
      );
    }
  } else {
    lDependencies = extractFromJavaScriptAST(
      pCruiseOptions,
      pFileName,
      pTranspileOptions
    );
  }

  return lDependencies.map((pDependency) => ({
    ...pDependency,
    ...extractModuleAttributes(pDependency.module),
  }));
}

function matchesDoNotFollow(pResolved, pDoNotFollow) {
  const lMatchesPath = Boolean(pDoNotFollow.path)
    ? RegExp(pDoNotFollow.path, "g").test(pResolved.resolved)
    : false;
  const lMatchesDependencyTypes = Boolean(pDoNotFollow.dependencyTypes)
    ? intersects(pResolved.dependencyTypes, pDoNotFollow.dependencyTypes)
    : false;

  return lMatchesPath || lMatchesDependencyTypes;
}

function addResolutionAttributes(pOptions, pFileName, pResolveOptions) {
  return function addAttributes(pDependency) {
    const lResolved = resolve(
      pDependency,
      pOptions.baseDir,
      path.join(pOptions.baseDir, path.dirname(pFileName)),
      pResolveOptions
    );
    const lMatchesDoNotFollow = matchesDoNotFollow(
      lResolved,
      pOptions.doNotFollow
    );

    return {
      ...lResolved,
      ...pDependency,
      followable: lResolved.followable && !lMatchesDoNotFollow,
      matchesDoNotFollow: lMatchesDoNotFollow,
    };
  };
}

function matchesPattern(pFullPathToFile, pPattern) {
  return RegExp(pPattern, "g").test(pFullPathToFile);
}

function getDependencyUniqueKey(pDependency) {
  return `${pDependency.module} ${pDependency.moduleSystem}`;
}

function compareDeps(pLeft, pRight) {
  return getDependencyUniqueKey(pLeft).localeCompare(
    getDependencyUniqueKey(pRight)
  );
}

/**
 * Returns an array of dependencies present in the given file. Of
 * each dependency it returns
 *   module        - the name of the module as found in the file
 *   resolved      - the filename the dependency resides in (including the path
 *                   to the current directory or the directory passed as
 *                   'baseDir' in the options)
 *   moduleSystems  - the module system(s)
 *   coreModule    - a boolean indicating whether it is a (nodejs) core module
 *
 *
 * @param  {string} pFileName path to the file
 * @param  {object} pCruiseOptions  an object with one or more of these properties:
 *                            - baseDir         - the directory to consider as the
 *                                                base for all files
 *                                                Default: the current working directory
 *                            - moduleSystems   - an array of module systems to
 *                                                consider.
 *                                                Default: ["cjs", "es6", "amd"]
 *                            - exclude         - a regular expression string
 *                                                with a pattern of modules to exclude
 *                                                (e.g. "(node_modules)"). Default: none
 *                            - preserveSymlinks - don't resolve symlinks.
 * @param {object} pResolveOptions an object with webpack 'enhanced-resolve' options
 * @param  {any} pTranspileOptions       an object with tsconfig ('typescript project') options
 *                               ('flattened' so there's no need for file access on any
 *                               'extends' option in there)
 * @return {array}           an array of dependency objects (see above)
 */
module.exports = function getDependencies(
  pFileName,
  pCruiseOptions,
  pResolveOptions,
  pTranspileOptions
) {
  try {
    return _uniqBy(
      extractDependencies(pCruiseOptions, pFileName, pTranspileOptions),
      getDependencyUniqueKey
    )
      .sort(compareDeps)
      .map(addResolutionAttributes(pCruiseOptions, pFileName, pResolveOptions))
      .filter(
        (pDep) =>
          (!_get(pCruiseOptions, "exclude.path") ||
            !matchesPattern(pDep.resolved, pCruiseOptions.exclude.path)) &&
          (!_get(pCruiseOptions, "includeOnly.path") ||
            matchesPattern(pDep.resolved, pCruiseOptions.includeOnly.path))
      );
  } catch (pError) {
    throw new Error(
      `Extracting dependencies ran afoul of...\n\n  ${pError.message}\n... in ${pFileName}\n\n`
    );
  }
};
