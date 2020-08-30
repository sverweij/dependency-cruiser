const _get = require("lodash/get");
const consolidateToPattern = require("../../utl/consolidate-to-pattern");
const compare = require("../../utl/compare");
const stripSelfTransitions = require("../../utl/strip-self-transitions");
const moduleUtl = require("./module-utl");

module.exports = (
  pResults,
  pTheme,
  pCollapsePattern = _get(
    pResults,
    "summary.optionsUsed.reporterOptions.archi.collapsePattern",
    "^(node_modules|packages|src|lib|app|test|spec)/[^/]+"
  )
) => {
  return (pCollapsePattern
    ? consolidateToPattern(pResults.modules, pCollapsePattern)
    : pResults.modules
  )
    .sort(compare.modules)
    .map(moduleUtl.extractFirstTransgression)
    .map(moduleUtl.folderify)
    .map(stripSelfTransitions)
    .map(moduleUtl.applyTheme(pTheme))
    .map(moduleUtl.addURL(_get(pResults, "summary.optionsUsed.prefix", "")));
};
