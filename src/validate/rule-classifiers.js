const has = require("lodash/has");
const get = require("lodash/get");

/**
 * @param {import("../../types/strict-rule-set").IStrictAnyRuleType} pRule a dependency-cruiser rule
 * @returns {boolean} whether or not the rule is 'module only'
 */
function isModuleOnlyRule(pRule) {
  return (
    has(pRule, "from.orphan") ||
    // note: the to might become optional for required rules
    has(pRule, "to.reachable") ||
    has(pRule, "module")
  );
}
/**
 *
 * @param {import("../../types/strict-rule-set").IStrictAnyRuleType} pRule
 * @returns {boolean} whether or not the scope of the rule is "folder" or something else
 */
function isFolderScope(pRule) {
  // TODO might be possible to just rule pRule.scope as it's now
  // normalized away before getting here.
  return get(pRule, "scope", "module") === "folder";
}

module.exports = { isModuleOnlyRule, isFolderScope };
