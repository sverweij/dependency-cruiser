/* eslint-disable security/detect-object-injection */
const ACORN_DUMMY_VALUE = "✖";
const REPORT_DEFAULTS = {
  minify: true,
};

const renderNode = (pNode, pText) =>
  `${pNode}["${pText.length > 0 ? pText : " "}"]`;

const renderEdge = (pFrom, pTo) => `${pFrom.node}-->${pTo.node}`;

const renderEdges = (pEdges) =>
  pEdges.map((pEdge) => renderEdge(pEdge.from, pEdge.to)).join("\n");

/**
 * @param {import('../../types/dependency-cruiser').ICruiseResult} pCruiseResult
 * @param {Map<string, string>} pNamesHashMap
 */
function convertEdgeSources(pCruiseResult, pNamesHashMap) {
  return pCruiseResult.modules.flatMap((pModule) => {
    const lFromNode = pNamesHashMap.get(pModule.source);
    const lFrom = {
      node: lFromNode,
      text: pModule.source.split("/").slice(-1)[0],
    };

    return pModule.dependencies.map((pDependency) => {
      const lToNode = pNamesHashMap.get(pDependency.resolved);
      return {
        from: lFrom,
        to: {
          node: lToNode,
          text: pDependency.resolved.split("/").slice(-1)[0],
        },
      };
    });
  });
}

const indent = (pDepth = 0, pMinify) => (pMinify ? "" : "  ".repeat(pDepth));

const renderSubgraph = (pNode, pText, pChildren, pIndent) =>
  `${pIndent}subgraph ${renderNode(pNode, pText)}
${pChildren}
${pIndent}end`;

function renderSubgraphs(pSource, pOptions, pDepth = 0) {
  return Object.keys(pSource)
    .map((pName) => {
      const lIndent = indent(pDepth, pOptions.minify);
      const source = pSource[pName];
      const children = renderSubgraphs(source.children, pOptions, pDepth + 1);
      if (children === "")
        return `${lIndent}${renderNode(source.node, source.text)}`;

      return renderSubgraph(source.node, source.text, children, lIndent);
    })
    .join("\n");
}

/**
 * @param {import('../../types/dependency-cruiser').ICruiseResult} pCruiseResult
 * @param {Map<string, string>} pNamesHashMap
 */
function convertSubgraphSources(pCruiseResult, pNamesHashMap) {
  let lTree = {};

  pCruiseResult.modules.forEach((pModule) => {
    const lPaths = pModule.source.split("/");

    lPaths.reduce((pChildren, pCurrentPath, pIndex) => {
      if (!pChildren[pCurrentPath]) {
        const node = lPaths.slice(0, pIndex + 1).join("/");
        pChildren[pCurrentPath] = {
          node: pNamesHashMap.get(node),
          text: pCurrentPath,
          children: {},
        };
      }
      return pChildren[pCurrentPath].children;
    }, lTree);
  });

  return lTree;
}

/**
 * @param {import("../../types/cruise-result").IModule[]} pModules
 * @param {Map<string, string>} pNamesHashMap
 */
function focusHighlights(pModules, pNamesHashMap) {
  const lHighLightStyle = "fill:lime,color:black";

  return pModules
    .filter(
      (pModule) =>
        pModule.matchesFocus ||
        pModule.matchesReaches ||
        pModule.matchesHighlight
    )
    .reduce((pAll, pModule) => {
      const lSource = pNamesHashMap.get(pModule.source);
      return `${pAll}\nstyle ${lSource} ${lHighLightStyle}`;
    }, "");
}

const hashToReadableNodeName = (pNode) =>
  pNode
    .replace(ACORN_DUMMY_VALUE, "__unknown__")
    .replace(/^\.$|^\.\//g, "__currentPath__")
    .replace(/^\.{2}$|^\.{2}\//g, "__prevPath__")
    .replace(/[[\]/.@~-]/g, "_");

/**
 * @param {import("../../types/cruise-result").IModule[]} pModules
 * @param {Boolean} pMinify
 * @return {Map<string, string>}
 */
function hashModuleNames(pModules, pMinify) {
  const lBase = 36;
  const lNamesHashMap = new Map();
  let lCount = 0;

  pModules.forEach((pModule) => {
    const lPaths = pModule.source.split("/");

    for (let lIndex = 0; lIndex < lPaths.length; lIndex += 1) {
      const lName = lPaths.slice(0, lIndex + 1).join("/");
      if (!lNamesHashMap.has(lName)) {
        if (pMinify) {
          // toUpperCase because otherwise we generate e.g. o-->a and x-->a
          // which are ambiguous in mermaid (o--> and x--> are edge shapes
          // whereas e.g. a--> is node 'a' + the arrow shape -->). The only
          // collision within alphanums are 'o' and 'x', so upper casing
          // saves us...
          // ref: https://mermaid.js.org/syntax/flowchart.html#new-arrow-types
          // another way to solve this would be to place a space between the
          // node name and the edge shape (x --> a) - however, this would make
          // for a larger output, running into the mermaid max source size
          // earlier
          lNamesHashMap.set(lName, lCount.toString(lBase).toUpperCase());
          lCount += 1;
        } else {
          lNamesHashMap.set(lName, hashToReadableNodeName(lName));
        }
      }
    }
  });

  return lNamesHashMap;
}

/**
 * @param {import('../../types/dependency-cruiser').ICruiseResult} pCruiseResult
 * @param {import("../../types/reporter-options").IMermaidReporterOptions} pOptions
 */
function renderMermaidSource(pCruiseResult, pOptions) {
  const lOptions = { ...REPORT_DEFAULTS, ...(pOptions || {}) };
  const lNamesHashMap = hashModuleNames(pCruiseResult.modules, lOptions.minify);
  const lSubgraphs = convertSubgraphSources(pCruiseResult, lNamesHashMap);
  const lEdges = convertEdgeSources(pCruiseResult, lNamesHashMap);

  return `flowchart LR

${renderSubgraphs(lSubgraphs, lOptions)}
${renderEdges(lEdges)}
${focusHighlights(pCruiseResult.modules, lNamesHashMap)}`;
}

/**
 * mermaid reporter
 *
 * @param {import('../../types/dependency-cruiser').ICruiseResult} pCruiseResult
 * @param {import("../../types/reporter-options").IMermaidReporterOptions} pOptions
 * @return {import('../../types/dependency-cruiser').IReporterOutput}
 */
export default function mermaid(pCruiseResult, pOptions) {
  return {
    output: renderMermaidSource(pCruiseResult, pOptions),
    exitCode: 0,
  };
}
