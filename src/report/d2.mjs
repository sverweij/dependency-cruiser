import { EOL } from "node:os";
import { basename, dirname } from "node:path";
import { getURLForModule } from "./utl/index.mjs";

const severity2color = new Map([
  ["error", "red"],
  ["warn", "orange"],
  ["info", "blue"],
]);

/**
 * @param {import("../../types/rule-summary").IRuleSummary} pRules
 * @returns {string}
 */
function getMaxSeverity(pRules) {
  const lSeverity2Number = new Map([
    // eslint-disable-next-line no-magic-numbers
    ["error", 3],
    // eslint-disable-next-line no-magic-numbers
    ["warn", 2],
    ["info", 1],
  ]);
  return pRules
    .map((pRule) => pRule.severity)
    .reduce((pMax, pCurrent) => {
      return (lSeverity2Number.get(pMax) ?? 0) >
        (lSeverity2Number.get(pCurrent) ?? 0)
        ? pMax
        : pCurrent;
    });
}

/**
 * @param {string} pSource
 * @return {string}
 */
function getVertexName(pSource) {
  const lFolderName = dirname(pSource)
    .split("/")
    .map((pPart) => `"${pPart}"`)
    .join(".");
  const lBaseName = `"${basename(pSource)}"`;
  if (lFolderName === `"."`) {
    return lBaseName;
  }
  return `${lFolderName}.${lBaseName}`;
}

/**
 * @param {import("../../types/cruise-result").IModule} pModule
 * @param {import("../../types/cruise-result").IOptions} pOptions
 * @returns {string}
 */
// eslint-disable-next-line complexity
function getModuleAttributes(pModule, pOptions) {
  let lReturnValue = "class: module";
  if (pModule.consolidated) {
    lReturnValue = `${lReturnValue}; style.multiple: true`;
  }
  if (
    pModule.matchesFocus ||
    pModule.matchesHighlight ||
    pModule.matchesReaches
  ) {
    lReturnValue = `${lReturnValue}; style.fill: yellow`;
  }
  if (pModule.valid === false) {
    lReturnValue = `${lReturnValue}; style.stroke: ${
      severity2color.get(getMaxSeverity(pModule.rules)) ?? "orange"
    }`;
    lReturnValue = `${lReturnValue}; tooltip: "${pModule.rules
      .map((pRule) => pRule.name)
      .join("\\n")}"`;
  }
  if (
    pModule.dependencyTypes?.some((pDependencyType) =>
      pDependencyType.includes("npm"),
    )
  ) {
    lReturnValue = `${lReturnValue}; shape: package`;
  }
  lReturnValue = `${lReturnValue}; link: "${getURLForModule(
    pModule,
    pOptions?.prefix,
  )}"`;
  return lReturnValue;
}

/**
 * @param {import("../../types/cruise-result").IDependency} pDependency
 * @returns {string}
 */
// eslint-disable-next-line complexity
function getDependencyAttributes(pDependency) {
  let lThing = "";
  if (pDependency.valid === false) {
    lThing =
      `style: {stroke: ${
        severity2color.get(getMaxSeverity(pDependency.rules)) ?? "orange"
      }}; ` +
      `label: "${pDependency.rules.map((pRule) => pRule.name).join("\\n")}"`;
  }
  if (pDependency.circular) {
    lThing = `${
      lThing ? `${lThing};` : lThing
    } target-arrowhead: {shape: circle}`;
  }
  if (pDependency.dynamic) {
    lThing = `${
      lThing ? `${lThing};` : lThing
    } target-arrowhead: {shape: arrow}`;
  }
  return lThing ? `: {${lThing}}` : lThing;
}

/**
 * @param {import('../../types/cruise-result').ICruiseResult} pCruiseResult
 * @return {string}
 */
function renderD2Source(pCruiseResult) {
  const lVertices = pCruiseResult.modules
    .map((pModule) => {
      return `${getVertexName(pModule.source)}: {${getModuleAttributes(
        pModule,
        pCruiseResult.summary.optionsUsed,
      )}}`;
    })
    .join(EOL);
  const lEdges = pCruiseResult.modules
    .flatMap((pModule) => {
      return pModule.dependencies.map((pDependency) => {
        return `${getVertexName(pModule.source)} -> ${getVertexName(
          pDependency.resolved,
        )}${getDependencyAttributes(pDependency)}`;
      });
    })
    .join(EOL);
  const lStyles = `classes: {
  module: {
    height: 30;
    style.border-radius: 10;
  }
}`;
  return (
    `# modules${EOL}${EOL}${lVertices}${EOL}${EOL}` +
    `# dependencies${EOL}${EOL}${lEdges}${EOL}${EOL}` +
    `# styling${EOL}${EOL}${lStyles}${EOL}`
  );
}
/**
 * d2 reporter
 *
 * @param {import('../../types/dependency-cruiser').ICruiseResult} pCruiseResult
 * @return {import('../../types/dependency-cruiser').IReporterOutput}
 */
export default function d2(pCruiseResult) {
  return {
    output: renderD2Source(pCruiseResult),
    exitCode: 0,
  };
}
