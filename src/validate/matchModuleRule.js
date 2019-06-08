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

function matchesReachableRule(pRule, pModule) {
    return pRule.to.hasOwnProperty('reachable') && (
        (
            pRule.to.reachable === pModule.reachable
        ) && (!pRule.to.path ||
            pModule.source.match(pRule.to.path)
        ) && (!pRule.to.pathNot ||
            !(pModule.source.match(pRule.to.pathNot))
        )
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
