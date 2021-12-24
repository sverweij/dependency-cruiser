const enrichModules = require("./enrich-modules");
const aggregateToFolders = require("./derive/folders");
const summarize = require("./summarize");
const clearCaches = require("./clear-caches");

module.exports = function enrich(pModules, pOptions, pFileAndDirectoryArray) {
  clearCaches();
  const lModules = enrichModules(pModules, pOptions);

  clearCaches();
  return {
    modules: lModules,
    ...aggregateToFolders(lModules, pOptions),
    summary: summarize(lModules, pOptions, pFileAndDirectoryArray),
  };
};
