import { join, extname, dirname } from "node:path";
import uniqBy from "lodash/uniqBy.js";
import { intersects } from "../utl/array-util.mjs";
import resolve from "./resolve/index.mjs";
import extractES6Deps from "./ast-extractors/extract-es6-deps.mjs";
import extractCommonJSDeps from "./ast-extractors/extract-cjs-deps.mjs";
import extractAMDDeps from "./ast-extractors/extract-amd-deps.mjs";
import extractTypeScriptDeps from "./ast-extractors/extract-typescript-deps.mjs";
import extractSwcDeps from "./ast-extractors/extract-swc-deps.mjs";
import toJavascriptAST from "./parse/to-javascript-ast.mjs";
import toTypescriptAST from "./parse/to-typescript-ast.mjs";
import toSwcAST from "./parse/to-swc-ast.mjs";
import {
  detectPreCompilationNess,
  extractModuleAttributes,
} from "./helpers.mjs";

function extractFromSwcAST({ baseDir, exoticRequireStrings }, pFileName) {
  return extractSwcDeps(
    toSwcAST.getASTCached(join(baseDir, pFileName)),
    exoticRequireStrings
  );
}

function extractFromTypeScriptAST(
  { baseDir, exoticRequireStrings },
  pFileName,
  pTranspileOptions
) {
  return extractTypeScriptDeps(
    toTypescriptAST.getASTCached(join(baseDir, pFileName), pTranspileOptions),
    exoticRequireStrings
  );
}

function isTypeScriptCompatible(pFileName) {
  return [
    ".ts",
    ".tsx",
    ".mts",
    ".cts",
    ".js",
    ".mjs",
    ".cjs",
    ".vue",
  ].includes(extname(pFileName));
}

function shouldUseTsc({ tsPreCompilationDeps, parser }, pFileName) {
  return (
    (tsPreCompilationDeps || parser === "tsc") &&
    toTypescriptAST.isAvailable() &&
    isTypeScriptCompatible(pFileName)
  );
}

function shouldUseSwc({ parser }, pFileName) {
  return (
    parser === "swc" &&
    toSwcAST.isAvailable() &&
    isTypeScriptCompatible(pFileName)
  );
}

function extractFromJavaScriptAST(
  { baseDir, moduleSystems, exoticRequireStrings },
  pFileName,
  pTranspileOptions
) {
  let lDependencies = [];
  const lAST = toJavascriptAST.getASTCached(
    join(baseDir, pFileName),
    pTranspileOptions
  );

  if (moduleSystems.includes("cjs")) {
    extractCommonJSDeps(lAST, lDependencies, "cjs", exoticRequireStrings);
  }
  if (moduleSystems.includes("es6")) {
    extractES6Deps(lAST, lDependencies);
  }
  if (moduleSystems.includes("amd")) {
    extractAMDDeps(lAST, lDependencies, exoticRequireStrings);
  }

  return lDependencies;
}

function extractWithSwc(pCruiseOptions, pFileName) {
  return extractFromSwcAST(pCruiseOptions, pFileName).filter(
    ({ moduleSystem }) => pCruiseOptions.moduleSystems.includes(moduleSystem)
  );
}

function extractWithTsc(pCruiseOptions, pFileName, pTranspileOptions) {
  let lDependencies = extractFromTypeScriptAST(
    pCruiseOptions,
    pFileName,
    pTranspileOptions
  ).filter(({ moduleSystem }) =>
    pCruiseOptions.moduleSystems.includes(moduleSystem)
  );

  if (pCruiseOptions.tsPreCompilationDeps === "specify") {
    lDependencies = detectPreCompilationNess(
      lDependencies,
      extractFromJavaScriptAST(pCruiseOptions, pFileName, pTranspileOptions)
    );
  }
  return lDependencies;
}

/**
 *
 * @param {import('../../types/dependency-cruiser.js').IStrictCruiseOptions} pCruiseOptions
 * @param {string} pFileName
 * @param {any} pTranspileOptions
 * @returns {import('../../types/cruise-result.js').IDependency[]}
 */
function extractDependencies(pCruiseOptions, pFileName, pTranspileOptions) {
  /** @type import('../../types/cruise-result.js').IDependency[] */
  let lDependencies = [];

  if (!pCruiseOptions.extraExtensionsToScan.includes(extname(pFileName))) {
    if (shouldUseSwc(pCruiseOptions, pFileName)) {
      lDependencies = extractWithSwc(pCruiseOptions, pFileName);
    } else if (shouldUseTsc(pCruiseOptions, pFileName)) {
      lDependencies = extractWithTsc(
        pCruiseOptions,
        pFileName,
        pTranspileOptions
      );
    } else {
      lDependencies = extractFromJavaScriptAST(
        pCruiseOptions,
        pFileName,
        pTranspileOptions
      );
    }
  }

  return lDependencies.map((pDependency) => ({
    ...pDependency,
    ...extractModuleAttributes(pDependency.module),
  }));
}

function matchesDoNotFollow({ resolved, dependencyTypes }, pDoNotFollow) {
  const lMatchesPath = Boolean(pDoNotFollow.path)
    ? RegExp(pDoNotFollow.path, "g").test(resolved)
    : false;
  const lMatchesDependencyTypes = Boolean(pDoNotFollow.dependencyTypes)
    ? intersects(dependencyTypes, pDoNotFollow.dependencyTypes)
    : false;

  return lMatchesPath || lMatchesDependencyTypes;
}

function addResolutionAttributes(
  { baseDir, doNotFollow },
  pFileName,
  pResolveOptions
) {
  return function addAttributes(pDependency) {
    const lResolved = resolve(
      pDependency,
      baseDir,
      join(baseDir, dirname(pFileName)),
      pResolveOptions
    );
    const lMatchesDoNotFollow = matchesDoNotFollow(lResolved, doNotFollow);

    return {
      ...pDependency,
      ...lResolved,
      followable: lResolved.followable && !lMatchesDoNotFollow,
      matchesDoNotFollow: lMatchesDoNotFollow,
    };
  };
}

function matchesPattern(pFullPathToFile, pPattern) {
  return RegExp(pPattern, "g").test(pFullPathToFile);
}

/**
 *
 * @param {import("../../types/dependency-cruiser.js").IDependency} pDependency
 * @returns {string}
 */
function getDependencyUniqueKey({ module, moduleSystem, dependencyTypes }) {
  return `${module} ${moduleSystem} ${(dependencyTypes || []).includes(
    "type-only"
  )}`;
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
 * @param  {import("../../types/dependency-cruiser.js").IStrictCruiseOptions} pCruiseOptions cruise options
 * @param {import("../../types/dependency-cruiser.js").IResolveOptions} pResolveOptions  webpack 'enhanced-resolve' options
 * @param  {import("../../types/dependency-cruiser.js").ITranspileOptions} pTranspileOptions       an object with tsconfig ('typescript project') options
 *                               ('flattened' so there's no need for file access on any
 *                               'extends' option in there)
 * @return {import("../../types/dependency-cruiser.js").IDependency[]} an array of dependency objects (see above)
 */
export default function getDependencies(
  pFileName,
  pCruiseOptions,
  pResolveOptions,
  pTranspileOptions
) {
  try {
    return uniqBy(
      extractDependencies(pCruiseOptions, pFileName, pTranspileOptions),
      getDependencyUniqueKey
    )
      .sort(compareDeps)
      .map(addResolutionAttributes(pCruiseOptions, pFileName, pResolveOptions))
      .filter(
        ({ resolved }) =>
          (!pCruiseOptions?.exclude?.path ||
            !matchesPattern(resolved, pCruiseOptions.exclude.path)) &&
          (!pCruiseOptions?.includeOnly?.path ||
            matchesPattern(resolved, pCruiseOptions.includeOnly.path))
      );
  } catch (pError) {
    throw new Error(
      `Extracting dependencies ran afoul of...\n\n  ${pError.message}\n... in ${pFileName}\n\n`
    );
  }
}
