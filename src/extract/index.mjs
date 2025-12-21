import extractDependencies from "./extract-dependencies.mjs";
import extractStats from "./extract-stats.mjs";
import gatherInitialSources from "./gather-initial-sources.mjs";
import clearCaches from "./clear-caches.mjs";
import { bus } from "#utl/bus.mjs";

/**
 * @import {IStrictCruiseOptions} from "../../types/options.mjs";
 * @import { IModule, IResolveOptions, ITranspileOptions } from "../../types/dependency-cruiser.mjs";
 */

/* eslint max-params:0 , max-lines-per-function:0*/
function extractRecursive(
  pFileName,
  pCruiseOptions,
  pVisited,
  pDepth,
  pResolveOptions,
  pTranspileOptions,
) {
  pVisited.add(pFileName);
  const lDependencies =
    pCruiseOptions.maxDepth <= 0 || pDepth < pCruiseOptions.maxDepth
      ? extractDependencies(
          pFileName,
          pCruiseOptions,
          pResolveOptions,
          pTranspileOptions,
        )
      : [];
  const lReturnValue = [
    {
      source: pFileName,
      ...(pCruiseOptions.experimentalStats
        ? {
            experimentalStats: extractStats(
              pFileName,
              pCruiseOptions,
              pTranspileOptions,
            ),
          }
        : {}),
      dependencies: lDependencies,
    },
  ];

  // eslint-disable-next-line budapestian/local-variable-pattern
  for (const { resolved, followable, matchesDoNotFollow } of lDependencies) {
    if (followable && !matchesDoNotFollow && !pVisited.has(resolved)) {
      lReturnValue.push(
        ...extractRecursive(
          resolved,
          pCruiseOptions,
          pVisited,
          pDepth + 1,
          pResolveOptions,
          pTranspileOptions,
        ),
      );
    }
  }
  return lReturnValue;
}

function extractFileDirectoryArray(
  pFileDirectoryArray,
  pCruiseOptions,
  pResolveOptions,
  pTranspileOptions,
) {
  let lVisited = new Set();

  bus.debug("extract: gather initial sources");
  const lInitialSources = gatherInitialSources(
    pFileDirectoryArray,
    pCruiseOptions,
  );

  bus.debug("extract: visit dependencies");
  const lResult = [];
  for (const lFilename of lInitialSources) {
    if (!lVisited.has(lFilename)) {
      lResult.push(
        ...extractRecursive(
          lFilename,
          pCruiseOptions,
          lVisited,
          0,
          pResolveOptions,
          pTranspileOptions,
        ),
      );
    }
  }
  return lResult;
}

function toDependencyAsModule(pToListItem) {
  return {
    source: pToListItem.resolved,
    followable: pToListItem.followable,
    coreModule: pToListItem.coreModule,
    couldNotResolve: pToListItem.couldNotResolve,
    matchesDoNotFollow: pToListItem.matchesDoNotFollow,
    dependencyTypes: pToListItem.dependencyTypes,
    dependencies: [],
  };
}

function complete(pModules, pModule) {
  return pModules
    .concat(pModule)
    .concat(
      pModule.dependencies
        .filter(
          ({ followable, resolved }) =>
            !followable && !pModules.some(({ source }) => source === resolved),
        )
        .map(toDependencyAsModule),
    );
}

function removeExcludedDynamicDependencies(pModule, pExclude) {
  // no need to do the 'path' thing as that was addressed in extractFileDirectoryArray already
  return {
    ...pModule,
    dependencies: pModule.dependencies.filter(
      ({ dynamic }) =>
        !Object.hasOwn(pExclude, "dynamic") || pExclude.dynamic !== dynamic,
    ),
  };
}

/**
 * Recursively runs through the modules matching the pFileDirectoryArray and
 * returns an array of all the modules it finds that way.
 *
 * @param {string[]} pFileDirectoryArray
 * @param {IStrictCruiseOptions} pCruiseOptions
 * @param {IResolveOptions} pResolveOptions
 * @param {ITranspileOptions} pTranspileOptions
 * @returns {Partial<IModule[]>}
 */
export default function extract(
  pFileDirectoryArray,
  pCruiseOptions,
  pResolveOptions,
  pTranspileOptions,
) {
  clearCaches();

  const lReturnValue = extractFileDirectoryArray(
    pFileDirectoryArray,
    pCruiseOptions,
    pResolveOptions,
    pTranspileOptions,
  )
    .reduce(complete, [])
    .map((pModule) =>
      removeExcludedDynamicDependencies(pModule, pCruiseOptions.exclude),
    );
  pResolveOptions.fileSystem.purge();
  clearCaches();
  return lReturnValue;
}
