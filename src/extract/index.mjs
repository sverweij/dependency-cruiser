import extractDependencies from "./extract-dependencies.mjs";
import extractStats from "./extract-stats.mjs";
import gatherInitialSources from "./gather-initial-sources.mjs";
import clearCaches from "./clear-caches.mjs";
import { bus } from "#utl/bus.mjs";

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

  return lDependencies
    .filter(
      ({ followable, matchesDoNotFollow }) => followable && !matchesDoNotFollow,
    )
    .reduce(
      (pAll, { resolved }) => {
        if (!pVisited.has(resolved)) {
          return pAll.concat(
            extractRecursive(
              resolved,
              pCruiseOptions,
              pVisited,
              pDepth + 1,
              pResolveOptions,
              pTranspileOptions,
            ),
          );
        }
        return pAll;
      },
      [
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
      ],
    );
}

function extractFileDirectoryArray(
  pFileDirectoryArray,
  pCruiseOptions,
  pResolveOptions,
  pTranspileOptions,
) {
  let lVisited = new Set();

  bus.info("reading files: gathering initial sources");
  const lInitialSources = gatherInitialSources(
    pFileDirectoryArray,
    pCruiseOptions,
  );

  bus.info("reading files: visiting dependencies");
  return lInitialSources.reduce((pDependencies, pFilename) => {
    if (!lVisited.has(pFilename)) {
      lVisited.add(pFilename);
      return pDependencies.concat(
        extractRecursive(
          pFilename,
          pCruiseOptions,
          lVisited,
          0,
          pResolveOptions,
          pTranspileOptions,
        ),
      );
    }
    return pDependencies;
  }, []);
}

function isNotFollowable({ followable }) {
  return !followable;
}

function notInFromListAlready(pFromList) {
  return ({ resolved }) => !pFromList.some(({ source }) => source === resolved);
}

function toDependencyToSource(pToListItem) {
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

function complete(pAll, pFromListItem) {
  return pAll
    .concat(pFromListItem)
    .concat(
      pFromListItem.dependencies
        .filter(isNotFollowable)
        .filter(notInFromListAlready(pAll))
        .map(toDependencyToSource),
    );
}

function filterExcludedDynamicDependencies(pModule, pExclude) {
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
 * @param {import("../../types/dependency-cruiser.js").IStrictCruiseOptions} pCruiseOptions
 * @param {import("../../types/dependency-cruiser.js").IResolveOptions} pResolveOptions
 * @param {import("../../types/dependency-cruiser.js").ITranspileOptions} pTranspileOptions
 * @returns {Partial<import("../../types/dependency-cruiser.js").IModule[]>}
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
      filterExcludedDynamicDependencies(pModule, pCruiseOptions.exclude),
    );
  pResolveOptions.fileSystem.purge();
  clearCaches();
  return lReturnValue;
}
