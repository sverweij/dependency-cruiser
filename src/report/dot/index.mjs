/* eslint-disable prefer-template */
import get from "lodash/get.js";
import theming from "./theming.mjs";
import moduleUtl from "./module-utl.mjs";
import prepareFolderLevel from "./prepare-folder-level.mjs";
import prepareCustomLevel from "./prepare-custom-level.mjs";
import prepareFlatLevel from "./prepare-flat-level.mjs";
import { applyFilters } from "#graph-utl/filter-bank.mjs";

// not importing EOL from "node:os" so output is the same on windows and unices
const EOL = "\n";

const GRANULARITY2FUNCTION = new Map([
  ["module", prepareCustomLevel],
  ["folder", prepareFolderLevel],
  ["custom", prepareCustomLevel],
  ["flat", prepareFlatLevel],
]);

const GRANULARITY2REPORTER_OPTIONS = new Map([
  ["module", "summary.optionsUsed.reporterOptions.dot"],
  ["folder", "summary.optionsUsed.reporterOptions.ddot"],
  ["custom", "summary.optionsUsed.reporterOptions.archi"],
  ["flat", "summary.optionsUsed.reporterOptions.flat"],
]);

function buildGraphAttributes(pGraph) {
  return Boolean(pGraph)
    ? `    ${moduleUtl.attributizeObject(pGraph || {})}`
    : "";
}

function buildNodeAttributes(pNode) {
  return Boolean(pNode)
    ? `    node [${moduleUtl.attributizeObject(pNode || {})}]`
    : "";
}

function buildEdgeAttributes(pEdge) {
  return Boolean(pEdge)
    ? `    edge [${moduleUtl.attributizeObject(pEdge || {})}]`
    : "";
}

function buildGeneralAttributes(pTheme) {
  return (
    buildGraphAttributes(pTheme.graph) +
    EOL +
    buildNodeAttributes(pTheme.node) +
    EOL +
    buildEdgeAttributes(pTheme.edge) +
    EOL
  );
}

function buildSingleFlatModule(pModule) {
  return `"${pModule.source}" [label=${pModule.label} tooltip="${
    pModule.tooltip
  }" ${pModule.URL ? 'URL="' + pModule.URL + '" ' : ""}${
    pModule.themeAttrs ?? ""
  }]`;
}

function buildSinglePath(pClustersHaveOwnNode) {
  return (pPath) => {
    let lReturnValue = `subgraph "cluster_${pPath.aggregateSnippet}" {label="${pPath.snippet}"`;
    if (pClustersHaveOwnNode) {
      lReturnValue += ` "${pPath.aggregateSnippet}" [width="0.05" shape="point" style="invis"]`;
    }
    return lReturnValue;
  };
}

function buildModuleHierarchy(pModule, pClustersHaveOwnNode) {
  return (
    pModule.path.map(buildSinglePath(pClustersHaveOwnNode)).join(" ") +
    " " +
    buildSingleFlatModule(pModule) +
    " }".repeat(pModule.path.length)
  );
}

function buildDependency(pModuleSource) {
  return (pDependency) => {
    let lReturnValue = `    "${pModuleSource}" -> "${pDependency.resolved}"`;
    if (pDependency.hasExtraAttributes) {
      lReturnValue +=
        " [" +
        (pDependency?.rule?.name
          ? `xlabel="${pDependency.rule.name}" tooltip="${pDependency.rule.name}" `
          : "") +
        (pDependency?.themeAttrs ?? "") +
        "]";
    }
    return lReturnValue;
  };
}

function buildModule(pClustersHaveOwnNode) {
  return (pModule) => {
    let lReturnValue = pModule.folder
      ? `    ${buildModuleHierarchy(pModule, pClustersHaveOwnNode)}`
      : `    ${buildSingleFlatModule(pModule)}`;
    if (pModule.dependencies && pModule.dependencies.length > 0) {
      lReturnValue +=
        EOL +
        pModule.dependencies.map(buildDependency(pModule.source)).join(EOL);
    }

    return lReturnValue;
  };
}

function buildModules(pModules, pClustersHaveOwnNode) {
  return pModules.map(buildModule(pClustersHaveOwnNode)).join(EOL);
}

function report(
  pResults,
  pGranularity,
  { theme, collapsePattern, filters, showMetrics },
) {
  const lTheme = theming.normalizeTheme(theme);
  const lResults = filters
    ? {
        ...pResults,
        modules: applyFilters(pResults.modules, filters),
      }
    : pResults;

  return (
    'strict digraph "dependency-cruiser output"{' +
    EOL +
    buildGeneralAttributes(lTheme) +
    EOL +
    buildModules(
      (GRANULARITY2FUNCTION.get(pGranularity) || prepareCustomLevel)(
        lResults,
        lTheme,
        collapsePattern,
        showMetrics,
      ),
      pGranularity === "folder",
    ) +
    EOL +
    `}${EOL}`
  );
}

function pryReporterOptionsFromResults(pGranularity, pResults) {
  const lFallbackReporterOptions =
    pResults?.summary?.optionsUsed?.reporterOptions?.dot;

  // using lodash.get here because the reporter options will contain nested
  // properties, which it handles for us
  return get(
    pResults,
    GRANULARITY2REPORTER_OPTIONS.get(pGranularity),
    lFallbackReporterOptions,
  );
}

function pryThemeFromResults(pGranularity, pResults) {
  const lFallbackTheme =
    pResults?.summary?.optionsUsed?.reporterOptions?.dot?.theme;

  return (
    pryReporterOptionsFromResults(pGranularity, pResults)?.theme ??
    lFallbackTheme
  );
}

function pryFiltersFromResults(pGranularity, pResults) {
  const lFallbackFilters =
    pResults?.summary?.optionsUsed?.reporterOptions?.dot?.filters;

  return (
    pryReporterOptionsFromResults(pGranularity, pResults)?.filters ??
    lFallbackFilters
  );
}

function getCollapseFallbackPattern(pGranularity) {
  if (pGranularity === "custom") {
    return "^(node_modules|packages|src|lib|app|test|spec)/[^/]+";
  }
  return null;
}

function pryCollapsePatternFromResults(pGranularity, pResults) {
  return (
    pryReporterOptionsFromResults(pGranularity, pResults)?.collapsePattern ??
    getCollapseFallbackPattern(pGranularity)
  );
}

function normalizeDotReporterOptions(
  pDotReporterOptions,
  pGranularity,
  pResults,
) {
  let lDotReporterOptions = pDotReporterOptions || {};

  return {
    theme:
      lDotReporterOptions.theme || pryThemeFromResults(pGranularity, pResults),
    collapsePattern:
      lDotReporterOptions.collapsePattern ||
      pryCollapsePatternFromResults(pGranularity, pResults),
    filters:
      lDotReporterOptions.filters ||
      pryFiltersFromResults(pGranularity, pResults),
    ...lDotReporterOptions,
  };
}

/**
 * Returns the results of a cruise as a directed graph in the dot language.
 *
 * @param {string} pGranularity - either "module" (for fine grained module
 *                                level) or "folder" (for a report consolidated
 *                                to folders)
 * @returns {(pResults, pDotReporterOptions) => import("../../../types/dependency-cruiser.js").IReporterOutput}
 */
export default function produceDotReporter(pGranularity) {
  return function dot(pResults, pDotReporterOptions) {
    const lDotReporterOptions = normalizeDotReporterOptions(
      pDotReporterOptions,
      pGranularity,
      pResults,
    );

    return {
      output: report(pResults, pGranularity, lDotReporterOptions),
      exitCode: 0,
    };
  };
}
