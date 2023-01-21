const IndexedModuleGraph = require("../../graph-utl/indexed-module-graph.js");

/** @type {Map<string,import('../../..').IModule>} */
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
 * @param {import('../../..').IModule[]} pModuleGraph
 * @param {string} pSource
 * @returns {import('../../..').IModule | undefined}
 */
function findModuleByName(pModuleGraph, pSource) {
  if (!gIndexedGraph) {
    gIndexedGraph = new IndexedModuleGraph(pModuleGraph);
  }
  return gIndexedGraph.findModuleByName(pSource);
}

function clearCache() {
  gIndexedGraph = null;
}

module.exports = {
  findModuleByName,
  clearCache,
};
