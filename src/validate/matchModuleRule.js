const isModuleOnlyRule = require('./isModuleOnlyRule');
const matches = require('./matches');

function matchesOrphanRule(pRule, pModule) {
    let lRetval = true;

    if (pRule.from.hasOwnProperty('orphan')) {
        if (pModule.hasOwnProperty('orphan')) {
            lRetval = (pModule.orphan === pRule.from.orphan) &&
                matches.fromPath(pRule, pModule) &&
                matches.fromPathNot(pRule, pModule);
        } else {
            lRetval = !pRule.from.orphan;
        }
    }
    return lRetval;
}

function matchesReachableRule(pRule, pModule) {
    let lRetval = true;

    if (pRule.to.hasOwnProperty('reachable')) {
        if (pModule.hasOwnProperty('reachable')) {
            lRetval = pModule.reachable
                .some(
                    pReachable =>
                        pReachable.asDefinedInRule === (pRule.name || 'not-in-allowed') &&
                        (pRule.to.reachable === pReachable.value)
                ) &&
                matches.toModulePath(pRule, pModule) &&
                matches.toModulePathNot(pRule, pModule);
        } else {
            lRetval = pRule.to.reachable;
        }
    }
    return lRetval;
}

function match(pModule){
    return pRule => matchesOrphanRule(pRule, pModule) && matchesReachableRule(pRule, pModule);
}
const isInteresting = pRule => isModuleOnlyRule(pRule);

module.exports = {
    match,
    isInteresting
};
