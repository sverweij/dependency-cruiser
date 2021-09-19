/* eslint-disable no-use-before-define */
/* eslint-disable security/detect-object-injection */
const path = require("path");

const DEFAULT_INDENT = 2;
const BASE_INDENT = " ".repeat(DEFAULT_INDENT);

function doInden(pMermaidSentences, pIndentLevel = 0) {
  return pMermaidSentences.map((pSentence) => {
    let lRepeatIndent = BASE_INDENT.repeat(pIndentLevel);
    if (pSentence.startsWith("subgraph")) {
      pIndentLevel += 1;
    }
    if (pSentence.startsWith("end")) {
      pIndentLevel -= 1;
      lRepeatIndent = BASE_INDENT.repeat(pIndentLevel);
    }
    return lRepeatIndent + pSentence;
  });
}

function transToTreeNodes(pCruiseResult) {
  const lTreeData = {};
  pCruiseResult.modules.forEach((pCurrentModule = {}) => {
    const lPathArray = pCurrentModule.source.split("/");
    lPathArray.reduce((pTreeChildrenNode, pCurrentPath, pIndex) => {
      if (!pTreeChildrenNode[pCurrentPath]) {
        pTreeChildrenNode[pCurrentPath] = {
          id: lPathArray.slice(0, pIndex + 1).join("/"),
          displayname: pCurrentPath,
          children: {},
        };
      }
      return pTreeChildrenNode[pCurrentPath].children;
    }, lTreeData);
  });

  return lTreeData;
}

function formatEdge(pSource, pTarget) {
  return `${pSource}[${path.basename(pSource)}] --> ${pTarget}[${path.basename(pTarget)}]`
}

function transToMermaidEdges(pCruiseResult) {
  return pCruiseResult.modules.reduce(
    (pAll, pCurrentModule) =>
      pAll.concat(
        pCurrentModule.dependencies.map((pDependency) =>
          formatEdge(pCurrentModule.source, pDependency.resolved)
        )
      ),
    []
  );
}

function transTreeNodesToMermaid(pTreeData = {}) {
  if (!pTreeData) return "";
  return Object.values(pTreeData).reduce((pAll, pNode) => {
    if (pNode.children && Object.values(pNode.children).length > 0) {
      return pAll.concat([
        `subgraph ${pNode.id}[${pNode.displayname}]`,
        ...transTreeNodesToMermaid(pNode.children),
        `end`,
      ]);
    }
    return pAll.concat(`${pNode.id}[${pNode.displayname}]`);
  }, []);
}

/**
 *
 * @param {import('../../types/dependency-cruiser').ICruiseResult} pCruiseResult
 */
function renderMermaidThing(pCruiseResult) {
  const lTreeNodes = transToTreeNodes(pCruiseResult);
  const lEdges = transToMermaidEdges(pCruiseResult);
  const lMermaidSentences = transTreeNodesToMermaid(lTreeNodes).concat(lEdges);
  const lMermaidSentencesWithIndent = doInden(lMermaidSentences);
  return `flowchart LR\n${lMermaidSentencesWithIndent.join('\n')}`;
}

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
