const _clone      = require('lodash/clone');
const _get        = require('lodash/get');
const isReachable = require('./isReachable');

function getReachableRule(pRuleSet) {
    return _get(pRuleSet, 'forbidden', []).find(pRule => pRule.to.hasOwnProperty('reachable')) ||
    _get(pRuleSet, 'allowed', []).find(pRule => pRule.to.hasOwnProperty('reachable'));
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
                                    reachable:
                                        pToModule.reachable || isReachable(pGraph, pFromSource, pToModule.source)
                                }
                                : {}
                        )
                ),
            _clone(pGraph)
        );

}

module.exports = (pGraph, pRuleSet) => {
    const lReachableRule = pRuleSet ? getReachableRule(pRuleSet) : false;

    if (lReachableRule) {
        return addReachableToGraph(pGraph, lReachableRule);
    }

    return pGraph;
};
