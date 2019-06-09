const isModuleOnlyRule = require('./isModuleOnlyRule');

function matchesOrphanRule(pRule, pModule) {
    return (
        pModule.orphan === true &&
            pRule.from.orphan === true
    ) && (!pRule.from.path ||
                pModule.source.match(pRule.from.path)
    ) && (!pRule.from.pathNot ||
            !(pModule.source.match(pRule.from.pathNot))
    );
}

function matchesReachableProperty(pRule, pModule) {
    return pRule.to.hasOwnProperty('reachable') &&
        (pModule.reachable || []).some(
            pReachable => pReachable.asDefinedInRule === pRule.name && pRule.to.reachable === pReachable.value
        );
}

function matchesReachableRule(pRule, pModule) {
    return matchesReachableProperty(pRule, pModule) &&
        (!pRule.to.path ||
            pModule.source.match(pRule.to.path)
        ) &&
        (!pRule.to.pathNot ||
            !(pModule.source.match(pRule.to.pathNot))
        );
}

function match(pModule){
    return pRule => matchesOrphanRule(pRule, pModule) || matchesReachableRule(pRule, pModule);
}
const isInteresting = pRule => isModuleOnlyRule(pRule);

module.exports = {
    match,
    isInteresting
};
