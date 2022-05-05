const has = require("lodash/has");
const get = require("lodash/get");

/**
 * @param {import("../../types/rule-set").IAnyRuleType} pRule a dependency-cruiser rule
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

function isFolderScope(pRule) {
  return get(pRule, "scope", "module") === "folder";
}

module.exports = { isModuleOnlyRule, isFolderScope };
