const _get = require("lodash/get");
const moduleUtl = require("./module-utl");

module.exports = (pResults, pTheme) => {
  return pResults.modules
    .sort(moduleUtl.compareOnSource)
    .map(moduleUtl.extractFirstTransgression)
    .map(moduleUtl.folderify)
    .map(moduleUtl.applyTheme(pTheme))
    .map(moduleUtl.addURL(_get(pResults, "summary.optionsUsed.prefix", "")));
};
