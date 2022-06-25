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

const mermaidNode = (pNode, pText) => `${pNode}["${pText}"]`;

const mermaidEdge = (pFrom, pTo) => {
  const lFromNode = pFrom.node;
  const lToNode = pTo.node;
  return `${lFromNode}-->${lToNode}`;
};

const mermaidEdges = (pEdges) => {
  return pEdges.map((pEdge) => mermaidEdge(pEdge.from, pEdge.to)).join("\n");
};

/**
 * @param {import('../../types/dependency-cruiser').ICruiseResult} pCruiseResult
 * @param {Map<string, string>} pNamesHashMap
 */
const convertedEdgeSources = (pCruiseResult, pNamesHashMap) => {
  return pCruiseResult.modules.flatMap((pModule) => {
    const lFromNode = pNamesHashMap.get(pModule.source);
    const lFrom = {
      node: lFromNode,
      text: pModule.source.split("/").slice(-1)[0],
    };

    return pModule.dependencies.map((pDep) => {
      const lToNode = pNamesHashMap.get(pDep.resolved);
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

const indent = (pDepth = 0, pMinify) => {
  return pMinify ? "" : "  ".repeat(pDepth);
};

const mermaidSubgraph = (pNode, pText, pChildren, pIndent) => {
  return `${pIndent}subgraph ${mermaidNode(pNode, pText)}
${pChildren}
${pIndent}end`;
};

const mermaidSubgraphs = (pSource, pOptions, pDepth = 0) => {
  return Object.keys(pSource)
    .map((pName) => {
      const lIndent = indent(pDepth, pOptions.minify);
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
          node: pMinifiedNames.get(node),
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
 * @param {Map<string, string>} pNamesHashMap
 */
const focusHighlights = (pModules, pNamesHashMap) => {
  const lHighLightStyle = "fill:lime,color:black";

  return pModules
    .filter((pModule) => pModule.matchesFocus === true)
    .reduce((pAll, pModule) => {
      const lSource = pNamesHashMap.get(pModule.source);
      return (pAll += `\nstyle ${lSource} ${lHighLightStyle}`);
    }, "");
};

/**
 * @param {import("../../types/cruise-result").IModule[]} pModules
 * @param {Boolean} pMinify
 * @return {Map<string, string>}
 */
const hashModuleNames = (pModules, pMinify) => {
  const lBase = 10;
  const lNamesHashMap = new Map();
  let lCount = 0;

  pModules.forEach((pModule) => {
    const lPaths = pModule.source.split("/");

    for (let lIndex = 0; lIndex < lPaths.length; lIndex += 1) {
      const lName = lPaths.slice(0, lIndex + 1).join("/");
      if (!lNamesHashMap.get(lName)) {
        if (pMinify) {
          lNamesHashMap.set(lName, lCount.toString(lBase));
          lCount += 1;
        } else {
          lNamesHashMap.set(lName, hashNodeName(lName));
        }
      }
    }
  });

  return lNamesHashMap;
};

/**
 * @param {import('../../types/dependency-cruiser').ICruiseResult} pCruiseResult
 * @param {import("../../types/reporter-options").IMermaidReporterOptions} pOptions
 */
const renderMermaidThing = (pCruiseResult, pOptions) => {
  const lOptions = { ...REPORT_DEFAULTS, ...(pOptions || {}) };
  const lNamesHashMap = hashModuleNames(pCruiseResult.modules, lOptions.minify);
  const lSubgraphs = convertedSubgraphSources(pCruiseResult, lNamesHashMap);
  const lEdges = convertedEdgeSources(pCruiseResult, lNamesHashMap);

  return `flowchart LR

${mermaidSubgraphs(lSubgraphs, lOptions)}
${mermaidEdges(lEdges)}
${focusHighlights(pCruiseResult.modules, lNamesHashMap)}`;
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
