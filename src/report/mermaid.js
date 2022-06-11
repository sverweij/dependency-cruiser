/* eslint-disable security/detect-object-injection */
const ACORN_DUMMY_VALUE = "✖";

const hashNodeName = (pNode) =>
  pNode
    .replace(ACORN_DUMMY_VALUE, "__unknown__")
    .replace(/^\.$|^\.\//g, "__currentPath__")
    .replace(/^\.{2}$|^\.{2}\//g, "__prevPath__")
    .replace(/[[\]/.@~-]/g, "_");

const mermaidNode = (pNode, pText) => `${hashNodeName(pNode)}["${pText}"]`;

const mermaidEdge = (pFrom, pTo) => {
  const lFromNode = hashNodeName(pFrom.node);
  const lToNode = hashNodeName(pTo.node);
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

const focusHighlights = (pModules) => {
  const lHighLightStyle = "fill:lime,color:black";

  return pModules
    .filter((pModule) => pModule.matchesFocus === true)
    .reduce(
      (pAll, pModule) =>
        (pAll += `\nstyle ${hashNodeName(pModule.source)} ${lHighLightStyle}`),
      ""
    );
};

const renderMermaidThing = (pCruiseResult) => {
  const subgraphs = convertedSubgraphSources(pCruiseResult);
  const edges = convertedEdgeSources(pCruiseResult);

  return `flowchart LR

${mermaidSubgraphs(subgraphs)}
${mermaidEdges(edges)}
${focusHighlights(pCruiseResult.modules)}`;
};

/**
 * mermaid reporter
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
