/** @type {Map<string,import('../../../types/cruise-result').IModule>} */
let gIndexedGraph = null;

/**
 * Returns the module with attribute pSource, when it exists in the pModuleGraph.
 * Returns undefined when it doesn't.
 *
 * This function uses an indexed cache for efficiency reasons. If you need to
 * call this function consecutively for different module graphs, you can clear
 * this cache with the clearCache function from this module.
 *
 * TODO: use IndexedModuleGraph class from src/graph-utl in stead
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

function metricsAreCalculable(pModule) {
  return (
    !pModule.coreModule &&
    !pModule.couldNotResolve &&
    !pModule.matchesDoNotFollow
  );
}

/**
 * returns the Instability of a component given the number of incoming (afferent)
 * and outgoign (efferent) connections ('couplings')
 *
 * @param {number} pEfferentCouplingCount
 * @param {number} pAfferentCouplingCount
 * @returns number
 */
function calculateInstability(pEfferentCouplingCount, pAfferentCouplingCount) {
  // when both afferentCouplings and efferentCouplings equal 0 instability will
  // yield NaN. Judging Bob Martin's intention, a component with no outgoing
  // dependencies is maximum stable (0)
  return (
    pEfferentCouplingCount /
      (pEfferentCouplingCount + pAfferentCouplingCount) || 0
  );
}

function clearCache() {
  gIndexedGraph = null;
}

module.exports = {
  findModuleByName,
  clearCache,
  isDependent,
  metricsAreCalculable,
  calculateInstability,
};
