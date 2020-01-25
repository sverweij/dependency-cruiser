const Handlebars = require("handlebars/runtime");
const _get = require("lodash/get");
const theming = require("./theming");
const moduleUtl = require("./module-utl");
const prepareFolderLevel = require("./prepareFolderLevel");
const prepareModuleLevel = require("./prepareModuleLevel");
const prepareCustomLevel = require("./prepareCustomLevel");

// eslint-disable-next-line import/no-unassigned-import
require("./dot.template");

const GRANULARITY2FUNCTION = {
  module: prepareModuleLevel,
  folder: prepareFolderLevel,
  custom: prepareCustomLevel
};

function report(pResults, pTheme, pGranularity, pCollapsePatterns) {
  const lTheme = theming.normalizeTheme(pTheme);

  return Handlebars.templates["dot.template.hbs"]({
    graphAttrs: moduleUtl.attributizeObject(lTheme.graph || {}),
    nodeAttrs: moduleUtl.attributizeObject(lTheme.node || {}),
    edgeAttrs: moduleUtl.attributizeObject(lTheme.edge || {}),
    clustersHaveOwnNode: ["folder", "custom"].includes(pGranularity),
    // eslint-disable-next-line security/detect-object-injection
    modules: (GRANULARITY2FUNCTION[pGranularity] || prepareModuleLevel)(
      pResults,
      lTheme,
      pCollapsePatterns
    )
  });
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
module.exports = pGranularity => (
  pResults,
  pTheme = _get(pResults, "summary.optionsUsed.reporterOptions.dot.theme"),
  pCollapsePatterns = _get(
    pResults,
    "summary.optionsUsed.reporterOptions.archi.collapsePattern",
    "^(node_modules|packages|src|lib|test|spec)/[^/]+"
  )
) => ({
  output: report(pResults, pTheme, pGranularity, pCollapsePatterns),
  exitCode: 0
});
