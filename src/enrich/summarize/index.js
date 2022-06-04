const compare = require("../../graph-utl/compare");
const addRuleSetUsed = require("./add-rule-set-used");
const summarizeModules = require("./summarize-modules");
const summarizeFolders = require("./summarize-folders");
const summarizeOptions = require("./summarize-options");
const {
  getViolationStats,
  getModulesCruised,
  getDependenciesCruised,
} = require("./get-stats");

/**
 *
 * @param {import("../../../types/cruise-result").IModule[]} pModules -
 *    cruised modules that have been enriched with mandatory attributes &
 *    have been validated against rules as passed in the options
 * @param {import("../../../types/options").IStrictCruiseOptions} pOptions -
 * @param {string[]} pFileDirectoryArray -
 *    the files/ directories originally passed to be cruised
 * @param {import("../../../types/dependency-cruiser").IFolder[]} pFolders -
 *    the pModules collapsed to folders, with their own metrics & deps
 *
 * @returns {import("../../../types/cruise-result").ISummary} -
 *    a summary of the found modules, dependencies and any violations
 */
module.exports = function summarize(
  pModules,
  pOptions,
  pFileDirectoryArray,
  pFolders
) {
  const lViolations = summarizeModules(pModules, pOptions.ruleSet)
    .concat(summarizeFolders(pFolders || [], pOptions.ruleSet))
    .sort(compare.violations);

  return {
    violations: lViolations,
    ...getViolationStats(lViolations),
    totalCruised: getModulesCruised(pModules),
    totalDependenciesCruised: getDependenciesCruised(pModules),
    ...summarizeOptions(pFileDirectoryArray, pOptions),
    ...(pOptions.ruleSet ? { ruleSetUsed: addRuleSetUsed(pOptions) } : {}),
  };
};
