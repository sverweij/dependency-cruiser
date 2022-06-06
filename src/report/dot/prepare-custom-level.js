const get = require("lodash/get");
const consolidateToPattern = require("../../graph-utl/consolidate-to-pattern");
const compare = require("../../graph-utl/compare");
const stripSelfTransitions = require("../../graph-utl/strip-self-transitions");
const moduleUtl = require("./module-utl");

module.exports = (pResults, pTheme, pCollapsePattern, pShowMetrics) => {
  return (
    pCollapsePattern
      ? consolidateToPattern(pResults.modules, pCollapsePattern)
      : pResults.modules
  )
    .sort(compare.modules)
    .map(moduleUtl.folderify(pShowMetrics))
    .map(moduleUtl.extractFirstTransgression)
    .map(stripSelfTransitions)
    .map(moduleUtl.applyTheme(pTheme))
    .map(moduleUtl.addURL(get(pResults, "summary.optionsUsed.prefix", "")));
};
