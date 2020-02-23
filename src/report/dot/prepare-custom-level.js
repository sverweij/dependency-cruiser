const _get = require("lodash/get");
const consolidateToPattern = require("../utl/consolidate-to-pattern");
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
    .sort(moduleUtl.compareOnSource)
    .map(moduleUtl.extractFirstTransgression)
    .map(moduleUtl.folderify)
    .map(moduleUtl.stripSelfTransitions)
    .map(moduleUtl.applyTheme(pTheme))
    .map(moduleUtl.addURL(_get(pResults, "summary.optionsUsed.prefix", "")));
};
