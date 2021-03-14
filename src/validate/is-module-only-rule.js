const _has = require("lodash/has");

/**
 * @param {any} pRule a dependency-cruiser rule
 * @returns {boolean} whether or not the rule is 'module only'
 */
function isModuleOnlyRule(pRule) {
  return (
    _has(pRule.from || {}, "orphan") ||
    // note: the to might become optional for required rules
    _has(pRule.to, "reachable") ||
    _has(pRule, "module") ||
    _has(pRule.to, "numberOfDependentsLessThan")
  );
}

module.exports = isModuleOnlyRule;
