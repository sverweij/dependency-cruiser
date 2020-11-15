const addRuleSetUsed = require("./add-rule-set-used");
const summarizeModules = require("./summarize-modules");
const summarizeOptions = require("./summarize-options");

/**
 *
 * @param {import("../../../types/cruise-result").IModule[]} pModules -
 *    cruised modules that have been enriched with mandatory attributes &
 *    have been validated against rules as passed in the options
 * @param {import("../../../types/options").ICruiseOptions} pOptions -
 *
 * @param {string[]} pFileDirectoryArray -
 *    the files/ directories originally passed to be cruised
 *
 * @returns {import("../../../types/cruise-result").ISummary} -
 *    a summary of the found modules, dependencies and any violations
 */
module.exports = function makeSummary(pModules, pOptions, pFileDirectoryArray) {
  return Object.assign(
    summarizeModules(pModules, pOptions.ruleSet),
    summarizeOptions(pFileDirectoryArray, pOptions),
    pOptions.ruleSet ? { ruleSetUsed: addRuleSetUsed(pOptions) } : {}
  );
};
