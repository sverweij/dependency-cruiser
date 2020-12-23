const _has = require("lodash/has");
const bus = require("../utl/bus");
const busLogLevels = require("../utl/bus-log-levels");
const getDependencies = require("./get-dependencies");
const gatherInitialSources = require("./gather-initial-sources");
const clearCaches = require("./clear-caches");

/* eslint max-params:0 */
function extractRecursive(
  pFileName,
  pCruiseOptions,
  pVisited,
  pDepth,
  pResolveOptions,
  pTranspileOptions
) {
  pVisited.add(pFileName);
  const lDependencies =
    pCruiseOptions.maxDepth <= 0 || pDepth < pCruiseOptions.maxDepth
      ? getDependencies(
          pFileName,
          pCruiseOptions,
          pResolveOptions,
          pTranspileOptions
        )
      : [];

  return lDependencies
    .filter(
      (pDependency) => pDependency.followable && !pDependency.matchesDoNotFollow
    )
    .reduce(
      (pAll, pDependency) => {
        if (!pVisited.has(pDependency.resolved)) {
          return pAll.concat(
            extractRecursive(
              pDependency.resolved,
              pCruiseOptions,
              pVisited,
              pDepth + 1,
              pResolveOptions,
              pTranspileOptions
            )
          );
        }
        return pAll;
      },
      [
        {
          source: pFileName,
          dependencies: lDependencies,
        },
      ]
    );
}

function extractFileDirectoryArray(
  pFileDirectoryArray,
  pCruiseOptions,
  pResolveOptions,
  pTranspileOptions
) {
  let lVisited = new Set();

  bus.emit("progress", "reading files: gathering initial sources", {
    level: busLogLevels.INFO,
  });
  const lInitialSources = gatherInitialSources(
    pFileDirectoryArray,
    pCruiseOptions
  );

  bus.emit("progress", "reading files: visiting dependencies", {
    level: busLogLevels.INFO,
  });
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
          pTranspileOptions
        )
      );
    }
    return pDependencies;
  }, []);
}

function isNotFollowable(pToDependency) {
  return !pToDependency.followable;
}

function notInFromListAlready(pFromList) {
  return (pToListItem) =>
    !pFromList.some(
      (pFromListItem) => pFromListItem.source === pToListItem.resolved
    );
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
        .map(toDependencyToSource)
    );
}

function filterExcludedDynamicDependencies(pModule, pExclude) {
  // no need to do the 'path' thing as that was addressed in extractFileDirectoryArray already
  return {
    ...pModule,
    dependencies: pModule.dependencies.filter(
      (pDependency) =>
        !_has(pExclude, "dynamic") || pExclude.dynamic !== pDependency.dynamic
    ),
  };
}

module.exports = function extract(
  pFileDirectoryArray,
  pCruiseOptions,
  pResolveOptions,
  pTranspileOptions
) {
  clearCaches();

  const lReturnValue = extractFileDirectoryArray(
    pFileDirectoryArray,
    pCruiseOptions,
    pResolveOptions,
    pTranspileOptions
  )
    .reduce(complete, [])
    .map((pModule) =>
      filterExcludedDynamicDependencies(pModule, pCruiseOptions.exclude)
    );
  pResolveOptions.fileSystem.purge();
  clearCaches();
  return lReturnValue;
};
