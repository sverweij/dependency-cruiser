const path = require("path");
const _get = require("lodash/get");
const _uniqBy = require("lodash/uniqBy");
const intersects = require("../utl/arrayUtil").intersects;
const resolve = require("./resolve");
const extractES6Deps = require("./ast-extractors/extract-ES6-deps");
const extractCommonJSDeps = require("./ast-extractors/extract-commonJS-deps");
const extractAMDDeps = require("./ast-extractors/extract-AMD-deps");
const extractTypeScriptDeps = require("./ast-extractors/extract-typescript-deps");
const getJSASTCached = require("./parse/toJavascriptAST").getASTCached;
const toTypescriptAST = require("./parse/toTypescriptAST");
const detectPreCompilationNess = require("./utl/detectPreCompilationNess");

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

function extractFromJavaScriptAST(pOptions, pFileName, pTSConfig) {
  let lDependencies = [];
  const lAST = getJSASTCached(
    path.join(pOptions.baseDir, pFileName),
    pTSConfig
  );

  if (pOptions.moduleSystems.indexOf("cjs") > -1) {
    extractCommonJSDeps(
      lAST,
      lDependencies,
      "cjs",
      pOptions.exoticRequireStrings
    );
  }
  if (pOptions.moduleSystems.indexOf("es6") > -1) {
    extractES6Deps(lAST, lDependencies);
  }
  if (pOptions.moduleSystems.indexOf("amd") > -1) {
    extractAMDDeps(lAST, lDependencies, pOptions.exoticRequireStrings);
  }

  return lDependencies;
}

function extractDependencies(pOptions, pFileName, pTSConfig) {
  let lDependencies = [];

  if (shouldUseTSC(pOptions, pFileName)) {
    lDependencies = extractFromTypeScriptAST(pOptions, pFileName).filter(pDep =>
      pOptions.moduleSystems.some(
        pModuleSystem => pModuleSystem === pDep.moduleSystem
      )
    );

    if (pOptions.tsPreCompilationDeps === "specify") {
      lDependencies = detectPreCompilationNess(
        lDependencies,
        extractFromJavaScriptAST(pOptions, pFileName, pTSConfig)
      );
    }
  } else {
    lDependencies = extractFromJavaScriptAST(pOptions, pFileName, pTSConfig);
  }

  return lDependencies;
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
  return pDependency => {
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
      matchesDoNotFollow: lMatchesDoNotFollow
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
 * @param  {object} pOptions  an object with one or more of these properties:
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
 * @param  {any} pTSConfig       an object with tsconfig ('typescript project') options
 *                               ('flattened' so there's no need for file access on any
 *                               'extends' option in there)
 * @return {array}           an array of dependency objects (see above)
 */
module.exports = (pFileName, pOptions, pResolveOptions, pTSConfig) => {
  try {
    return _uniqBy(
      extractDependencies(pOptions, pFileName, pTSConfig),
      getDependencyUniqueKey
    )
      .sort(compareDeps)
      .map(addResolutionAttributes(pOptions, pFileName, pResolveOptions))
      .filter(
        pDep =>
          (!_get(pOptions, "exclude.path") ||
            !matchesPattern(pDep.resolved, pOptions.exclude.path)) &&
          (!pOptions.includeOnly ||
            matchesPattern(pDep.resolved, pOptions.includeOnly))
      );
    // .value();
  } catch (e) {
    throw new Error(
      `Extracting dependencies ran afoul of...\n\n  ${e.message}\n... in ${pFileName}\n\n`
    );
  }
};
