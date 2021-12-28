const enrichModules = require("./enrich-modules");
const aggregateToFolders = require("./derive/folders");
const summarize = require("./summarize");
const clearCaches = require("./clear-caches");

module.exports = function enrich(pModules, pOptions, pFileAndDirectoryArray) {
  clearCaches();
  const lModules = enrichModules(pModules, pOptions);
  const lFolders = aggregateToFolders(lModules, pOptions);

  clearCaches();
  const lReturnValue = {
    modules: lModules,
    ...lFolders,
    summary: summarize(
      lModules,
      pOptions,
      pFileAndDirectoryArray,
      lFolders.folders
    ),
  };

  return lReturnValue;
};
