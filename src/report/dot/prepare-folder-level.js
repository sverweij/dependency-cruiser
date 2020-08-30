const _get = require("lodash/get");
const consolidateToFolder = require("../../utl/consolidate-to-folder");
const compare = require("../../utl/compare");
const stripSelfTransitions = require("../../utl/strip-self-transitions");
const moduleUtl = require("./module-utl");

module.exports = (pResults, pTheme) => {
  return consolidateToFolder(pResults.modules)
    .sort(compare.modules)
    .map(moduleUtl.extractFirstTransgression)
    .map(moduleUtl.folderify)
    .map(stripSelfTransitions)
    .map(moduleUtl.applyTheme(pTheme))
    .map(moduleUtl.addURL(_get(pResults, "summary.optionsUsed.prefix", "")));
};
