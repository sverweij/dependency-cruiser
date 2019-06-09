const _clone      = require('lodash/clone');
const _get        = require('lodash/get');
const isReachable = require('./isReachable');

function getReachableRules(pRuleSet) {
    return _get(pRuleSet, 'forbidden', [])
        .filter(pRule => pRule.to.hasOwnProperty('reachable'))
        .concat(
            _get(pRuleSet, 'allowed', [])
                .filter(pRule => pRule.to.hasOwnProperty('reachable'))
        );
}

function onlyModulesInRuleFrom (pRule) {
    return (pModule) =>
        (!pRule.from.path || pModule.source.match(pRule.from.path)) &&
        (!pRule.from.pathNot || !(pModule.source.match(pRule.from.pathNot)));
}


function isModuleInRuleTo (pRule, pModule) {
    return (!pRule.to.path || pModule.source.match(pRule.to.path)) &&
        (!pRule.to.pathNot || !(pModule.source.match(pRule.to.pathNot)));
}

function mergeReachableProperties(pToModule, pRule, pIsReachable) {
    const lReachables = (pToModule.reachable || []);
    const lIndexExistingReachable = lReachables.findIndex(pReachable => pReachable.asDefinedInRule === pRule.name);

    if (lIndexExistingReachable > -1) {
        // eslint-disable-next-line security/detect-object-injection
        lReachables[lIndexExistingReachable].value = lReachables[lIndexExistingReachable].value || pIsReachable;
        return lReachables;
    } else {
        return lReachables.concat({value: pIsReachable, asDefinedInRule: pRule.name || 'not-in-allowed'});
    }
}

function addReachableToGraph (pGraph, pReachableRule) {
    return pGraph
        .filter(onlyModulesInRuleFrom(pReachableRule))
        .map(pModule => pModule.source)
        .reduce(
            (pReturnGraph, pFromSource) =>
                pReturnGraph.map(
                    pToModule =>
                        Object.assign(
                            {},
                            pToModule,
                            isModuleInRuleTo(pReachableRule, pToModule)
                                ? {
                                    reachable: mergeReachableProperties(
                                        pToModule,
                                        pReachableRule,
                                        isReachable(pGraph, pFromSource, pToModule.source)
                                    )
                                }
                                : {}
                        )
                ),
            _clone(pGraph)
        );

}

module.exports = (pGraph, pRuleSet) => {
    const lReachableRules = pRuleSet ? getReachableRules(pRuleSet) : [];

    return lReachableRules.reduce(
        (pReturnGraph, pRule) => addReachableToGraph(pReturnGraph, pRule),
        _clone(pGraph)
    );

};
