const { findModuleByName } = require("../utl");
/* about the absence of checks whether attributes/ objects actually
 * exist:
 * - it saves CPU cycles to the effect of being ~30% faster than with the
 *   checks
 * - .dependencies is a mandatory attribute (as per json schema)
 * - .resolved is a mandatory attribute (as per json schema)
 */

/**
 * Returns the first non-zero length path from pInitialSource to pInitialSource
 * Returns the empty array if there is no such path
 *
 * @param  {any} pGraph      The graph in which to test this condition
 * @param  {string} pInitialSource The 'source' attribute of the node to be tested
 *                              (source uniquely identifying a node)
 * @param  {string} pCurrentSource   The 'source' attribute of the 'to' node to
 *                              be traversed
 * @param  {Set} pVisited       The set of nodes visited hithereto (optional
 *                              attribute - there's no need to pass it when
 *                              calling it; it's used by the algorithm to
 *                              determine the stop condition)
 * @return {string[]}           see description above
 */
function getCycle(pGraph, pInitialSource, pCurrentSource, pVisited) {
  pVisited = pVisited || new Set();

  const lCurrentNode = findModuleByName(pGraph, pCurrentSource);
  const lDependencies = lCurrentNode.dependencies.filter(
    (pDependency) => !pVisited.has(pDependency.resolved)
  );
  const lMatch = lDependencies.find(
    (pDependency) => pDependency.resolved === pInitialSource
  );
  if (lMatch) {
    return [pCurrentSource, lMatch.resolved];
  }
  return lDependencies.reduce((pAll, pDependency) => {
    if (!pAll.includes(pCurrentSource)) {
      const lCycle = getCycle(
        pGraph,
        pInitialSource,
        pDependency.resolved,
        pVisited.add(pDependency.resolved)
      );

      if (lCycle.length > 0 && !lCycle.includes(pCurrentSource)) {
        return pAll.concat(pCurrentSource).concat(lCycle);
      }
    }
    return pAll;
  }, []);
}

module.exports = getCycle;
