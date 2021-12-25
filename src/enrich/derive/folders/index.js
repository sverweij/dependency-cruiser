const aggregateToFolders = require("./aggregate-to-folders");

module.exports = function deriveFolderMetrics(pModules, pOptions) {
  let lReturnValue = {};
  if (pOptions.metrics) {
    lReturnValue = { folders: aggregateToFolders(pModules) };
  }
  return lReturnValue;
};
