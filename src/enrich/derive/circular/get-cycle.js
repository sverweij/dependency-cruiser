/* eslint-disable security/detect-object-injection */
/* about the absence of checks whether attributes/ objects actually
 * exist:
 * - it saves CPU cycles to the effect of being ~30% faster than with the
 *   checks
 * - .dependencies is a mandatory attribute (as per json schema)
 * - .resolved is a mandatory attribute (as per json schema)
 */

// eslint-disable-next-line max-params
function walk(
  pGraph,
  pInitialSource,
  pCurrentSource,
  { pDependencyName, pFindNodeByName },
  pVisited
) {
  let lVisited = pVisited || new Set();
  const lCurrentNode = pFindNodeByName(pGraph, pCurrentSource);
  const lDependencies = lCurrentNode.dependencies.filter(
    (pDependency) => !lVisited.has(pDependency[pDependencyName])
  );
  const lMatch = lDependencies.find(
    (pDependency) => pDependency[pDependencyName] === pInitialSource
  );
  if (lMatch) {
    return [pCurrentSource, lMatch[pDependencyName]];
  }
  return lDependencies.reduce((pAll, pDependency) => {
    if (!pAll.includes(pCurrentSource)) {
      const lCycle = walk(
        pGraph,
        pInitialSource,
        pDependency[pDependencyName],
        { pDependencyName, pFindNodeByName },
        lVisited.add(pDependency[pDependencyName])
      );

      if (lCycle.length > 0 && !lCycle.includes(pCurrentSource)) {
        return pAll.concat(pCurrentSource).concat(lCycle);
      }
    }
    return pAll;
  }, []);
}

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
 * @return {string[]}             see description above
 */

module.exports = function getCycle(
  pGraph,
  pInitialSource,
  pCurrentSource,
  { pDependencyName, pFindNodeByName }
) {
  return walk(pGraph, pInitialSource, pCurrentSource, {
    pDependencyName,
    pFindNodeByName,
  });
};
