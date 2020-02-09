const _get = require("lodash/get");
const consolidateToFolder = require("../utl/consolidateToFolder");
const moduleUtl = require("./module-utl");

module.exports = (pResults, pTheme) => {
  return consolidateToFolder(pResults.modules)
    .sort(moduleUtl.compareOnSource)
    .map(moduleUtl.extractFirstTransgression)
    .map(moduleUtl.folderify)
    .map(moduleUtl.stripSelfTransitions)
    .map(moduleUtl.applyTheme(pTheme))
    .map(moduleUtl.addURL(_get(pResults, "summary.optionsUsed.prefix", "")));
};
