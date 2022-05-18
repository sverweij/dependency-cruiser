/* eslint-disable security/detect-object-injection */
const mermaidNode = (pNode, pText) => {
  const lNode = pNode
    .replace(/^\.$|^\.\//g, "__currentPath__")
    .replace(/^\.{2}$|^\.{2}\//g, "__prevPath__")
    .replace(/[[\]/.@]/g, "");
  const lText = pText ? `["${pText}"]` : "";
  return `${lNode}${lText}`;
};

const mermaidEdge = (pFrom, pTo) => {
  const lFromNode = mermaidNode(pFrom.node);
  const lToNode = mermaidNode(pTo.node);
  return `${lFromNode} --> ${lToNode}`;
};

const mermaidEdges = (pEdges) => {
  return pEdges.map((pEdge) => mermaidEdge(pEdge.from, pEdge.to)).join("\n");
};

const convertedEdgeSources = (pCruiseResult) => {
  return pCruiseResult.modules.flatMap((pModule) => {
    const lFrom = {
      node: pModule.source,
      text: pModule.source.split("/").slice(-1)[0],
    };

    return pModule.dependencies.map((pDep) => {
      return {
        from: lFrom,
        to: {
          node: pDep.resolved,
          text: pDep.resolved.split("/").slice(-1)[0],
        },
      };
    });
  });
};

const indent = (pDepth = 0) => {
  return "  ".repeat(pDepth);
};

const mermaidSubgraph = (pNode, pText, pChildren, pDepth) => {
  return `${indent(pDepth)}subgraph ${mermaidNode(pNode, pText)}
${pChildren}
${indent(pDepth)}end`;
};

const mermaidSubgraphs = (pSource, pDepth = 0) => {
  return Object.keys(pSource)
    .map((pName) => {
      const source = pSource[pName];
      const children = mermaidSubgraphs(source.children, pDepth + 1);
      if (children === "")
        return `${indent(pDepth)}${mermaidNode(source.node, source.text)}`;

      return mermaidSubgraph(source.node, source.text, children, pDepth);
    })
    .join("\n");
};

const convertedSubgraphSources = (pCruiseResult) => {
  let lTree = {};

  pCruiseResult.modules.forEach((pModule) => {
    const paths = pModule.source.split("/");

    paths.reduce((pChildren, pCurrentPath, pIndex) => {
      if (!pChildren[pCurrentPath]) {
        pChildren[pCurrentPath] = {
          node: paths.slice(0, pIndex + 1).join("/"),
          text: pCurrentPath,
          children: {},
        };
      }
      return pChildren[pCurrentPath].children;
    }, lTree);
  });

  return lTree;
};

const renderMermaidThing = (pCruiseResult) => {
  const subgraphs = convertedSubgraphSources(pCruiseResult);
  const edges = convertedEdgeSources(pCruiseResult);

  return `
flowchart LR

${mermaidSubgraphs(subgraphs)}
${mermaidEdges(edges)}
`;
};

/**
 * mermaid reporter plugin
 *
 * @param {import('../../types/dependency-cruiser').ICruiseResult} pCruiseResult -
 *      the output of a dependency-cruise adhering to dependency-cruiser's
 *      cruise result schema
 * @return {import('../../types/dependency-cruiser').IReporterOutput} -
 *      output: a string
 *      exitCode: 0
 */
module.exports = (pCruiseResult) => ({
  output: renderMermaidThing(pCruiseResult),
  exitCode: 0,
});
