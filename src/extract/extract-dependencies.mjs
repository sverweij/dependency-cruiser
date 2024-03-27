import { join, extname, dirname } from "node:path";
import uniqBy from "lodash/uniqBy.js";
import { extract as acornExtract } from "./acorn/extract.mjs";
import {
  extract as tscExtract,
  shouldUse as tscShouldUse,
} from "./tsc/extract.mjs";
import {
  extract as swcExtract,
  shouldUse as swcShouldUse,
} from "./swc/extract.mjs";
import resolve from "./resolve/index.mjs";
import {
  detectPreCompilationNess,
  extractModuleAttributes,
} from "./helpers.mjs";
import { intersects } from "#utl/array-util.mjs";

function extractWithTsc(pCruiseOptions, pFileName, pTranspileOptions) {
  let lDependencies = tscExtract(pCruiseOptions, pFileName, pTranspileOptions);

  if (pCruiseOptions.tsPreCompilationDeps === "specify") {
    lDependencies = detectPreCompilationNess(
      lDependencies,
      acornExtract(pCruiseOptions, pFileName, pTranspileOptions),
    );
  }
  return lDependencies;
}

/**
 * @param {IStrictCruiseOptions} pCruiseOptions
 * @param {string} pFileName
 * @returns {(IStrictCruiseOptions, string, any) => import("../../types/cruise-result.mjs").IDependency[]}
 */
function determineExtractionFunction(pCruiseOptions, pFileName) {
  let lExtractionFunction = acornExtract;

  if (tscShouldUse(pCruiseOptions, pFileName)) {
    lExtractionFunction = extractWithTsc;
  } else if (swcShouldUse(pCruiseOptions, pFileName)) {
    lExtractionFunction = swcExtract;
  }

  return lExtractionFunction;
}

/**
 * @param {import('../../types/dependency-cruiser.js').IStrictCruiseOptions} pCruiseOptions
 * @param {string} pFileName
 * @param {any} pTranspileOptions
 * @returns {import('../../types/cruise-result.mjs').IDependency[]}
 */
function extractDependencies(pCruiseOptions, pFileName, pTranspileOptions) {
  /** @type import('../../types/cruise-result.mjs').IDependency[] */
  let lDependencies = [];

  if (!pCruiseOptions.extraExtensionsToScan.includes(extname(pFileName))) {
    const lExtractionFunction = determineExtractionFunction(
      pCruiseOptions,
      pFileName,
    );
    lDependencies = lExtractionFunction(
      pCruiseOptions,
      pFileName,
      pTranspileOptions,
    );
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
  pResolveOptions,
  pTranspileOptions,
) {
  return function addAttributes(pDependency) {
    const lResolved = resolve(
      pDependency,
      baseDir,
      join(baseDir, dirname(pFileName)),
      pResolveOptions,
      pTranspileOptions,
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
  // c8: dependencyTypes is hardly ever undefined anymore since PR #884, but
  //     we keep the `|| []` in for robustness sake
  return `${module} ${moduleSystem} ${(dependencyTypes || []).includes(
    "type-only",
  )}`;
}

function compareDeps(pLeft, pRight) {
  return getDependencyUniqueKey(pLeft).localeCompare(
    getDependencyUniqueKey(pRight),
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
  pTranspileOptions,
) {
  try {
    return uniqBy(
      extractDependencies(pCruiseOptions, pFileName, pTranspileOptions),
      getDependencyUniqueKey,
    )
      .sort(compareDeps)
      .map(
        addResolutionAttributes(
          pCruiseOptions,
          pFileName,
          pResolveOptions,
          pTranspileOptions,
        ),
      )
      .filter(
        ({ resolved }) =>
          (!pCruiseOptions?.exclude?.path ||
            !matchesPattern(resolved, pCruiseOptions.exclude.path)) &&
          (!pCruiseOptions?.includeOnly?.path ||
            matchesPattern(resolved, pCruiseOptions.includeOnly.path)),
      );
  } catch (pError) {
    throw new Error(
      `Extracting dependencies ran afoul of...\n\n  ${pError.message}\n... in ${pFileName}\n\n`,
    );
  }
}
