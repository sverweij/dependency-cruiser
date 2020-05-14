const Handlebars = require("handlebars/runtime");
const _get = require("lodash/get");
const theming = require("./theming");
const moduleUtl = require("./module-utl");
const prepareFolderLevel = require("./prepare-folder-level");
const prepareCustomLevel = require("./prepare-custom-level");

// eslint-disable-next-line import/no-unassigned-import
require("./dot.template");

function prepareModuleLevel(
  pResults,
  pTheme,
  pCollapsePattern = _get(
    pResults,
    "summary.optionsUsed.reporterOptions.dot.collapsePattern",
    null
  )
) {
  return prepareCustomLevel(pResults, pTheme, pCollapsePattern);
}

const GRANULARITY2FUNCTION = {
  module: prepareModuleLevel,
  folder: prepareFolderLevel,
  custom: prepareCustomLevel,
};

function report(pResults, pGranularity, { theme, collapsePattern }) {
  const lTheme = theming.normalizeTheme(theme);

  return Handlebars.templates["dot.template.hbs"]({
    graphAttrs: moduleUtl.attributizeObject(lTheme.graph || {}),
    nodeAttrs: moduleUtl.attributizeObject(lTheme.node || {}),
    edgeAttrs: moduleUtl.attributizeObject(lTheme.edge || {}),
    clustersHaveOwnNode: "folder" === pGranularity,
    // eslint-disable-next-line security/detect-object-injection
    modules: (GRANULARITY2FUNCTION[pGranularity] || prepareCustomLevel)(
      pResults,
      lTheme,
      collapsePattern
    ),
  });
}

const GRANULARITY2REPORTER_OPTIONS = {
  module: "summary.optionsUsed.reporterOptions.dot",
  folder: "summary.optionsUsed.reporterOptions.ddot",
  custom: "summary.optionsUsed.reporterOptions.archi",
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
module.exports = (pGranularity) => (pResults, pTheme, pCollapsePattern) => {
  const lTheme = pTheme || pryThemeFromResults(pGranularity, pResults);

  return {
    output: report(pResults, pGranularity, {
      theme: lTheme,
      collapsePattern: pCollapsePattern,
    }),
    exitCode: 0,
  };
};
