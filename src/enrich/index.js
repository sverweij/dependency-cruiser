const enrichModules = require("./enrich-modules");
const deriveFolderMetrics = require("./derive/metrics/folder.js");
const summarize = require("./summarize");
const clearCaches = require("./clear-caches");

module.exports = function enrich(pModules, pOptions, pFileAndDirectoryArray) {
  clearCaches();
  const lModules = enrichModules(pModules, pOptions);

  clearCaches();
  return {
    modules: lModules,
    ...deriveFolderMetrics(lModules, pOptions),
    summary: summarize(lModules, pOptions, pFileAndDirectoryArray),
  };
};
