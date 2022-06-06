const get = require("lodash/get");
const compare = require("../../graph-utl/compare");
const moduleUtl = require("./module-utl");

module.exports = (pResults, pTheme, _, pShowMetrics) => {
  return pResults.modules
    .sort(compare.modules)
    .map(moduleUtl.flatLabel(pShowMetrics))
    .map(moduleUtl.extractFirstTransgression)
    .map(moduleUtl.applyTheme(pTheme))
    .map(moduleUtl.addURL(get(pResults, "summary.optionsUsed.prefix", "")));
};
