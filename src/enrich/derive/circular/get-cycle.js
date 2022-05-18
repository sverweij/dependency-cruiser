/* eslint-disable security/detect-object-injection */
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
 * @param {any} pGraph            The graph in which to test this condition
 * @param {string} pInitialSource The 'source' attribute of the node to be tested
 *                                (source uniquely identifying a node)
 * @param {string} pCurrentSource The 'source' attribute of the 'to' node to
 *                                be traversed
 * @param {string} pDependencyName The attribute name of the dependency to use.
 *                                defaults to "resolved" (which is in use for
 *                                modules). For folders pass "name"
 * @param {function} pFindNodeByName Function taking a Graph and a pCurrentSource string
 *                                that returns the Node in that graph going by
 *                                that name. Defaults to findModuleByName (which
 *                                is in use for modules). For folders pass
 *                                findFolderByName
 * @param {Set} pVisited          The set of nodes visited hithereto (optional
 *                                attribute - there's no need to pass it when
 *                                calling it; it's used by the algorithm to
 *                                determine the stop condition)
 * @return {string[]}             see description above
 */
// eslint-disable-next-line max-params
function getCycle(
  pGraph,
  pInitialSource,
  pCurrentSource,
  { pDependencyName, pFindNodeByName },
  pVisited
) {
  pVisited = pVisited || new Set();

  const lCurrentNode = pFindNodeByName(pGraph, pCurrentSource);
  const lDependencies = lCurrentNode.dependencies.filter(
    (pDependency) => !pVisited.has(pDependency[pDependencyName])
  );
  const lMatch = lDependencies.find(
    (pDependency) => pDependency[pDependencyName] === pInitialSource
  );
  if (lMatch) {
    return [pCurrentSource, lMatch[pDependencyName]];
  }
  return lDependencies.reduce((pAll, pDependency) => {
    if (!pAll.includes(pCurrentSource)) {
      const lCycle = getCycle(
        pGraph,
        pInitialSource,
        pDependency[pDependencyName],
        { pDependencyName, pFindNodeByName },
        pVisited.add(pDependency[pDependencyName])
      );

      if (lCycle.length > 0 && !lCycle.includes(pCurrentSource)) {
        return pAll.concat(pCurrentSource).concat(lCycle);
      }
    }
    return pAll;
  }, []);
}

module.exports = getCycle;
