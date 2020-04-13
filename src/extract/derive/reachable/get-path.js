// eslint-ignore complexity - TODO: simplify(?)
function getPath(pGraph, pFrom, pTo, pVisited = new Set()) {
  let lReturnValue = [];
  const lFromNode = pGraph.find(pNode => pNode.source === pFrom);

  pVisited.add(pFrom);

  if (lFromNode) {
    const lDirectUnvisitedDependencies = lFromNode.dependencies
      .filter(pDependency => !pVisited.has(pDependency.resolved))
      .map(pDependency => pDependency.resolved);
    if (
      lDirectUnvisitedDependencies.some(
        pDirectDependency => pDirectDependency === pTo
      )
    ) {
      lReturnValue = [pFrom, pTo];
    } else {
      for (const lFrom of lDirectUnvisitedDependencies) {
        let lCandidatePath = getPath(pGraph, lFrom, pTo, pVisited);
        // eslint-disable-next-line max-depth
        if (lCandidatePath.length > 0) {
          lReturnValue = [pFrom].concat(lCandidatePath);
          break;
        }
      }
    }
  }
  return lReturnValue;
}

module.exports = getPath;
