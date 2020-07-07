/**
 * @param {any} pRule a dependency-cruiser rule
 * @returns {boolean} whether or not the rule is 'module only'
 */
function isModuleOnlyRule(pRule) {
  return (
    Object.prototype.hasOwnProperty.call(pRule.from || {}, "orphan") ||
    // note: the to might become optional for required rules
    Object.prototype.hasOwnProperty.call(pRule.to, "reachable") ||
    Object.prototype.hasOwnProperty.call(pRule, "module")
  );
}

module.exports = isModuleOnlyRule;
