const isModuleOnlyRule = require('./isModuleOnlyRule');

function matchesOrphanRule(pRule, pModule) {
    return (
        pRule.from.hasOwnProperty('orphan') &&
            pModule.orphan === pRule.from.orphan
    ) && (!pRule.from.path ||
                pModule.source.match(pRule.from.path)
    ) && (!pRule.from.pathNot ||
            !(pModule.source.match(pRule.from.pathNot))
    );
}

function match(pModule){
    return pRule => matchesOrphanRule(pRule, pModule);
}

const isInteresting = pRule => isModuleOnlyRule(pRule);

module.exports = {
    match,
    isInteresting
};
