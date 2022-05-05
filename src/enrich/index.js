const enrichModules = require("./enrich-modules");
const aggregateToFolders = require("./derive/folders");
const summarize = require("./summarize");
const clearCaches = require("./clear-caches");

/**
 * Enriches the passed modules with things like cycle detection, validations,
 * metrics, folders and reachability & dependents analysis.
 *
 * Also adds a summary to the cruise result with common stats and the options
 * used in the cruise, so consumers of the cruise result (reporters, depcruise-fmt,
 * caching) can use that.
 *
 * @param {import("../../types/dependency-cruiser").IModule[]} pModules
 * @param {import("../../types/dependency-cruiser").ICruiseOptions} pOptions
 * @param {string[]} pFileAndDirectoryArray
 * @returns {import("../../types/dependency-cruiser").ICruiseResult}
 */
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
