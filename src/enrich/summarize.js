const summarizeModules = require("./summarize-modules");
const summarizeOptions = require("./summarize-options");
const addRuleSetUsed = require("./add-rule-set-used");

module.exports = function makeSummary(pModules, pOptions, pFileDirectoryArray) {
  return Object.assign(
    summarizeModules(pModules, pOptions.ruleSet),
    summarizeOptions(pFileDirectoryArray, pOptions),
    pOptions.ruleSet ? { ruleSetUsed: addRuleSetUsed(pOptions) } : {}
  );
};
