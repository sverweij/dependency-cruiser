/* eslint-disable security/detect-object-injection */
const ACORN_DUMMY_VALUE = "✖";

const REPORT_DEFAULTS = {
  minify: true,
};

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
  return `${lFromNode}-->${lToNode}`;
};

const mermaidEdges = (pEdges) => {
  return pEdges.map((pEdge) => mermaidEdge(pEdge.from, pEdge.to)).join("\n");
};

/**
 * @param {import('../../types/dependency-cruiser').ICruiseResult} pCruiseResult
 * @param {Map<string, string>} pMinifiedNames
 */
const convertedEdgeSources = (pCruiseResult, pMinifiedNames) => {
  return pCruiseResult.modules.flatMap((pModule) => {
    const lFromNode = pMinifiedNames.get(pModule.source) || pModule.source;
    const lFrom = {
      node: lFromNode,
      text: pModule.source.split("/").slice(-1)[0],
    };

    return pModule.dependencies.map((pDep) => {
      const lToNode = pMinifiedNames.get(pDep.resolved) || pDep.resolved;
      return {
        from: lFrom,
        to: {
          node: lToNode,
          text: pDep.resolved.split("/").slice(-1)[0],
        },
      };
    });
  });
};

const indent = (pDepth = 0) => {
  return "  ".repeat(pDepth);
};

const mermaidSubgraph = (pNode, pText, pChildren, pIndent) => {
  return `${pIndent}subgraph ${mermaidNode(pNode, pText)}
${pChildren}
${pIndent}end`;
};

const mermaidSubgraphs = (pSource, pOptions, pDepth = 0) => {
  return Object.keys(pSource)
    .map((pName) => {
      const lIndent = pOptions.minify ? "" : indent(pDepth);
      const source = pSource[pName];
      const children = mermaidSubgraphs(source.children, pOptions, pDepth + 1);
      if (children === "")
        return `${lIndent}${mermaidNode(source.node, source.text)}`;

      return mermaidSubgraph(source.node, source.text, children, lIndent);
    })
    .join("\n");
};

/**
 * @param {import('../../types/dependency-cruiser').ICruiseResult} pCruiseResult
 * @param {Map<string, string>} pMinifiedNames
 */
const convertedSubgraphSources = (pCruiseResult, pMinifiedNames) => {
  let lTree = {};

  pCruiseResult.modules.forEach((pModule) => {
    const paths = pModule.source.split("/");

    paths.reduce((pChildren, pCurrentPath, pIndex) => {
      if (!pChildren[pCurrentPath]) {
        const node = paths.slice(0, pIndex + 1).join("/");
        pChildren[pCurrentPath] = {
          node: pMinifiedNames.get(node) || node,
          text: pCurrentPath,
          children: {},
        };
      }
      return pChildren[pCurrentPath].children;
    }, lTree);
  });

  return lTree;
};

/**
 * @param {import("../../types/cruise-result").IModule[]} pModules
 * @param {Map<string, string>} pMinifiedNames
 */
const focusHighlights = (pModules, pMinifiedNames) => {
  const lHighLightStyle = "fill:lime,color:black";

  return pModules
    .filter((pModule) => pModule.matchesFocus === true)
    .reduce((pAll, pModule) => {
      const lSource = pMinifiedNames.get(pModule.source) || pModule.source;
      return (pAll += `\nstyle ${hashNodeName(lSource)} ${lHighLightStyle}`);
    }, "");
};

/**
 * @param {import("../../types/cruise-result").IModule[]} pModules
 * @param {Boolean} pMinify
 * @return {Map<string, string>}
 */
const minifiedNames = (pModules, pMinify) => {
  const names = new Map();
  if (!pMinify) return names;

  let lCount = 0;
  pModules.forEach((pModule) => {
    const lPaths = pModule.source.split("/");

    for (let lIndex = 0; lIndex < lPaths.length; lIndex += 1) {
      const lName = lPaths.slice(0, lIndex + 1).join("/");
      if (!names.get(lName)) {
        names.set(lName, lCount.toString());
        lCount += 1;
      }
    }
  });

  return names;
};

/**
 * @param {import('../../types/dependency-cruiser').ICruiseResult} pCruiseResult
 * @param {import("../../types/reporter-options").IMermaidReporterOptions} pOptions
 */
const renderMermaidThing = (pCruiseResult, pOptions) => {
  const lOptions = { ...REPORT_DEFAULTS, ...(pOptions || {}) };
  const names = minifiedNames(pCruiseResult.modules, lOptions.minify);
  const subgraphs = convertedSubgraphSources(pCruiseResult, names);
  const edges = convertedEdgeSources(pCruiseResult, names);

  return `flowchart LR

${mermaidSubgraphs(subgraphs, lOptions)}
${mermaidEdges(edges)}
${focusHighlights(pCruiseResult.modules, names)}`;
};

/**
 * mermaid reporter
 *
 * @param {import('../../types/dependency-cruiser').ICruiseResult} pCruiseResult
 * @param {import("../../types/reporter-options").IMermaidReporterOptions} pOptions
 * @return {import('../../types/dependency-cruiser').IReporterOutput}
 */
module.exports = (pCruiseResult, pOptions) => ({
  output: renderMermaidThing(pCruiseResult, pOptions),
  exitCode: 0,
});
