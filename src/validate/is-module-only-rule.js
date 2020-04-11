/**
 * @param {any} pRule a dependency-cruiser rule
 * @returns {boolean} whether or not the rule is 'module only'
 */
function isModuleOnlyRule(pRule) {
  return (
    Object.prototype.hasOwnProperty.call(pRule.from, "orphan") ||
    Object.prototype.hasOwnProperty.call(pRule.to, "reachable")
  );
}

module.exports = isModuleOnlyRule;
