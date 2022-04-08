/* eslint-disable security/detect-object-injection */
const getCycle = require("./get-cycle");

function addCircularityCheckToDependency(
  pGraph,
  pFrom,
  pToDep,
  { pDependencyName, pFindNodeByName }
) {
  let lReturnValue = {
    ...pToDep,
    circular: false,
  };
  const lCycle = getCycle(pGraph, pFrom, pToDep[pDependencyName], {
    pDependencyName,
    pFindNodeByName,
  });

  if (lCycle.length > 0) {
    lReturnValue = {
      ...lReturnValue,
      circular: true,
      cycle: lCycle,
    };
  }

  return lReturnValue;
}

/**
 * Runs through all dependencies of all pNodes, for each of them determines
 * whether it's (part of a) circular (relationship) and returns the
 * dependencies with that added.
 */
module.exports = (
  pNodes,
  { pSourceAttribute, pDependencyName, pFindNodeByName }
) =>
  pNodes.map((pModule) => ({
    ...pModule,
    dependencies: pModule.dependencies.map((pToDep) =>
      addCircularityCheckToDependency(
        pNodes,
        pModule[pSourceAttribute],
        pToDep,
        {
          pDependencyName,
          pFindNodeByName,
        }
      )
    ),
  }));
