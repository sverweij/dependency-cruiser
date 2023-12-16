/* eslint-disable security/detect-object-injection */

function addCircularityCheckToDependency(
  pIndexedGraph,
  pFrom,
  pToDep,
  pDependencyName,
) {
  let lReturnValue = {
    ...pToDep,
    circular: false,
  };
  const lCycle = pIndexedGraph.getCycle(pFrom, pToDep[pDependencyName]);

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
export default function detectAndAddCycles(
  pNodes,
  pIndexedNodes,
  { pSourceAttribute, pDependencyName },
) {
  return pNodes.map((pModule) => ({
    ...pModule,
    dependencies: pModule.dependencies.map((pToDep) =>
      addCircularityCheckToDependency(
        pIndexedNodes,
        pModule[pSourceAttribute],
        pToDep,
        pDependencyName,
      ),
    ),
  }));
}
