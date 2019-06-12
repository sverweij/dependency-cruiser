/**
 * @param {any} pRule a dependency-cruiser rule
 * @returns {boolean} whether or not the rule is 'module only'
 */
function isModuleOnlyRule(pRule){
    return pRule.from.hasOwnProperty("orphan") || pRule.to.hasOwnProperty("reachable");
}

module.exports = isModuleOnlyRule;
