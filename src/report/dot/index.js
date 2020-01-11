const Handlebars = require("handlebars/runtime");
const _get = require("lodash/get");
const theming = require("./theming");
const moduleUtl = require("./module-utl");
const prepareFolderLevel = require("./prepareFolderLevel");
const prepareModuleLevel = require("./prepareModuleLevel");

// eslint-disable-next-line import/no-unassigned-import
require("./dot.template");

function report(pResults, pTheme, pPreparationLevel) {
  const lTheme = theming.normalizeTheme(pTheme);

  return Handlebars.templates["dot.template.hbs"]({
    graphAttrs: moduleUtl.attributizeObject(lTheme.graph || {}),
    nodeAttrs: moduleUtl.attributizeObject(lTheme.node || {}),
    edgeAttrs: moduleUtl.attributizeObject(lTheme.edge || {}),
    clustersHaveOwnNode: pPreparationLevel !== "module",
    modules:
      pPreparationLevel === "module"
        ? prepareModuleLevel(pResults, lTheme)
        : prepareFolderLevel(pResults, lTheme)
  });
}

/**
 * Returns the results of a cruise as a directed graph in the dot language.
 *
 * @param {string} pPreparationLevel - either "module" (for fine grained module
 *                                     level) or "folder" (for a report consolidated
 *                                     to folders)
 * @param {ICruiseResult} pResults - the output of a dependency-cruise adhering to ../../../schema/cruise-result.schema.json
 * @param {IDotTheme} pTheme - a mapping of source properties to a attributes (like
 *                      color, shape) - see ../comon/richTheme.json for an example
 * @returns {IReporterOutput} - .output: the directed graph
 *                              .exitCode: 0
 */
module.exports = pPreparationLevel => (
  pResults,
  pTheme = _get(pResults, "summary.optionsUsed.reporterOptions.dot.theme")
) => ({
  output: report(pResults, pTheme, pPreparationLevel),
  exitCode: 0
});
