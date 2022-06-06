const get = require("lodash/get");
const consolidateToFolder = require("../../graph-utl/consolidate-to-folder");
const compare = require("../../graph-utl/compare");
const stripSelfTransitions = require("../../graph-utl/strip-self-transitions");
const moduleUtl = require("./module-utl");

module.exports = (pResults, pTheme, _, pShowMetrics) => {
  return consolidateToFolder(pResults.modules)
    .sort(compare.modules)
    .map(moduleUtl.extractFirstTransgression)
    .map(moduleUtl.folderify(pShowMetrics))
    .map(stripSelfTransitions)
    .map(moduleUtl.applyTheme(pTheme))
    .map(moduleUtl.addURL(get(pResults, "summary.optionsUsed.prefix", "")));
};
