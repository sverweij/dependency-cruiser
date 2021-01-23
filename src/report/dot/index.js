const Handlebars = require("handlebars/runtime");
const _get = require("lodash/get");
const filterbank = require("../../graph-utl/filterbank");
const theming = require("./theming");
const moduleUtl = require("./module-utl");
const prepareFolderLevel = require("./prepare-folder-level");
const prepareCustomLevel = require("./prepare-custom-level");
const prepareFlatLevel = require("./prepare-flat-level");

// eslint-disable-next-line import/no-unassigned-import
require("./dot.template");

const GRANULARITY2FUNCTION = {
  module: prepareCustomLevel,
  folder: prepareFolderLevel,
  custom: prepareCustomLevel,
  flat: prepareFlatLevel,
};

function report(pResults, pGranularity, { theme, collapsePattern, filters }) {
  const lTheme = theming.normalizeTheme(theme);
  const lResults = filters
    ? {
        ...pResults,
        modules: filterbank.applyFilters(pResults.modules, filters),
      }
    : pResults;

  return Handlebars.templates["dot.template.hbs"]({
    graphAttrs: moduleUtl.attributizeObject(lTheme.graph || {}),
    nodeAttrs: moduleUtl.attributizeObject(lTheme.node || {}),
    edgeAttrs: moduleUtl.attributizeObject(lTheme.edge || {}),
    clustersHaveOwnNode: "folder" === pGranularity,
    // eslint-disable-next-line security/detect-object-injection
    modules: (GRANULARITY2FUNCTION[pGranularity] || prepareCustomLevel)(
      lResults,
      lTheme,
      collapsePattern
    ),
  });
}

const GRANULARITY2REPORTER_OPTIONS = {
  module: "summary.optionsUsed.reporterOptions.dot",
  folder: "summary.optionsUsed.reporterOptions.ddot",
  custom: "summary.optionsUsed.reporterOptions.archi",
  flat: "summary.optionsUsed.reporterOptions.flat",
};

function pryReporterOptionsFromResults(pGranularity, pResults) {
  const lFallbackReporterOptions = _get(
    pResults,
    "summary.optionsUsed.reporterOptions.dot"
  );

  return _get(
    pResults,
    // eslint-disable-next-line security/detect-object-injection
    GRANULARITY2REPORTER_OPTIONS[pGranularity],
    lFallbackReporterOptions
  );
}

function pryThemeFromResults(pGranularity, pResults) {
  const lFallbackTheme = _get(
    pResults,
    "summary.optionsUsed.reporterOptions.dot.theme"
  );
  return _get(
    pryReporterOptionsFromResults(pGranularity, pResults),
    "theme",
    lFallbackTheme
  );
}

function pryFiltersFromResults(pGranularity, pResults) {
  const lFallbackFilters = _get(
    pResults,
    "summary.optionsUsed.reporterOptions.dot.filters"
  );
  return _get(
    pryReporterOptionsFromResults(pGranularity, pResults),
    "filters",
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
  return _get(
    pryReporterOptionsFromResults(pGranularity, pResults),
    "collapsePattern",
    getCollapseFallbackPattern(pGranularity)
  );
}

function normalizeDotReporterOptions(
  pDotReporterOptions,
  pGranularity,
  pResults
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
 * @param {ICruiseResult} pResults - the output of a dependency-cruise adhering to
 *                                   ../../../schema/cruise-result.schema.json
 * @param {IDotTheme} pTheme - a mapping of source properties to a attributes (like
 *                             color, shape) - see ../comon/richTheme.json for an example
 * @param {ICollapsePattern[]} - (for the 'custom' granularity level)
 * @returns {IReporterOutput} - .output: the directed graph
 *                              .exitCode: 0
 */
module.exports = (pGranularity) => (pResults, pDotReporterOptions) => {
  const lDotReporterOptions = normalizeDotReporterOptions(
    pDotReporterOptions,
    pGranularity,
    pResults
  );

  return {
    output: report(pResults, pGranularity, lDotReporterOptions),
    exitCode: 0,
  };
};
