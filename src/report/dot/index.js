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

function report(pResults, pTheme, pGranularity, pCollapsePattern) {
  const lTheme = theming.normalizeTheme(pTheme);

  return Handlebars.templates["dot.template.hbs"]({
    graphAttrs: moduleUtl.attributizeObject(lTheme.graph || {}),
    nodeAttrs: moduleUtl.attributizeObject(lTheme.node || {}),
    edgeAttrs: moduleUtl.attributizeObject(lTheme.edge || {}),
    clustersHaveOwnNode: "folder" === pGranularity,
    // eslint-disable-next-line security/detect-object-injection
    modules: (GRANULARITY2FUNCTION[pGranularity] || prepareCustomLevel)(
      pResults,
      lTheme,
      pCollapsePattern
    ),
  });
}

const GRANULARITY2THEMEORIGIN = {
  module: "summary.optionsUsed.reporterOptions.dot.theme",
  folder: "summary.optionsUsed.reporterOptions.ddot.theme",
  custom: "summary.optionsUsed.reporterOptions.archi.theme",
};

function pryThemeFromResults(pGranularity, pResults) {
  const lFallbackTheme = _get(
    pResults,
    "summary.optionsUsed.reporterOptions.dot.theme"
  );

  // eslint-disable-next-line security/detect-object-injection
  return _get(pResults, GRANULARITY2THEMEORIGIN[pGranularity], lFallbackTheme);
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
    output: report(pResults, lTheme, pGranularity, pCollapsePattern),
    exitCode: 0,
  };
};
