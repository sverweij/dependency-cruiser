const findNodeByName = require("../find-module-by-name");

function getCycle(pGraph, pInitialSource, pCurrentSource, pVisited) {
  pVisited = pVisited || new Set();

  const lCurrentNode = findNodeByName(pGraph, pCurrentSource);
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
