const enrichModules = require("./enrich-modules");
const summarize = require("./summarize");

module.exports = function enrich(pModules, pOptions, pFileAndDirectoryArray) {
  const lModules = enrichModules(pModules, pOptions);

  return {
    modules: lModules,
    summary: summarize(lModules, pOptions, pFileAndDirectoryArray),
  };
};
