const _get = require("lodash/get");
const compare = require("../../graph-utl/compare");
const moduleUtl = require("./module-utl");

module.exports = (pResults, pTheme) => {
  return pResults.modules
    .sort(compare.modules)
    .map(moduleUtl.flatLabel)
    .map(moduleUtl.extractFirstTransgression)
    .map(moduleUtl.applyTheme(pTheme))
    .map(moduleUtl.addURL(_get(pResults, "summary.optionsUsed.prefix", "")));
};
