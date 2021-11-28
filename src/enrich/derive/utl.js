let gIndexedGraph = null;

/**
 * Returns the module with attribute pSource, when it exists in the pModuleGraph.
 * Returns undefined when it doesn't.
 *
 * This function uses an indexed cache for efficiency reasons. If you need to
 * call this function consecutively for different module graphs, you can clear
 * this cache with the clearCache function from this module.
 *
 * @param {import('../../../types/cruise-result').IModule[]} pModuleGraph
 * @param {string} pSource
 * @returns {import('../../../types/cruise-result').IModule | undefined}
 */
function findModuleByName(pModuleGraph, pSource) {
  if (!gIndexedGraph) {
    gIndexedGraph = new Map(
      pModuleGraph.map((pModule) => [pModule.source, pModule])
    );
  }
  return gIndexedGraph.get(pSource);
}

function isDependent(pResolvedName) {
  return (pModule) =>
    pModule.dependencies.some(
      (pDependency) => pDependency.resolved === pResolvedName
    );
}

function clearCache() {
  gIndexedGraph = null;
}

module.exports = {
  findModuleByName,
  clearCache,
  isDependent,
};
