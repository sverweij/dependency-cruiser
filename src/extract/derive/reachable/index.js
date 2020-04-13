/* eslint-disable security/detect-object-injection */
/* eslint-disable complexity */

const _clone = require("lodash/clone");
const _get = require("lodash/get");
const getPath = require("./get-path");

function getReachableRules(pRuleSet) {
  return _get(pRuleSet, "forbidden", [])
    .filter(pRule =>
      Object.prototype.hasOwnProperty.call(pRule.to, "reachable")
    )
    .concat(
      _get(pRuleSet, "allowed", []).filter(pRule =>
        Object.prototype.hasOwnProperty.call(pRule.to, "reachable")
      )
    );
}

function isModuleInRuleFrom(pRule) {
  return pModule =>
    (!pRule.from.path || pModule.source.match(pRule.from.path)) &&
    (!pRule.from.pathNot || !pModule.source.match(pRule.from.pathNot));
}

function isModuleInRuleTo(pRule) {
  return pModule =>
    (!pRule.to.path || pModule.source.match(pRule.to.path)) &&
    (!pRule.to.pathNot || !pModule.source.match(pRule.to.pathNot));
}

// eslint-disable-next-line complexity
function mergeReachableProperties(pModule, pRule, pPath) {
  const lReachables = pModule.reachable || [];
  const lIndexExistingReachable = lReachables.findIndex(
    pReachable =>
      pReachable.asDefinedInRule === (pRule.name || "not-in-allowed")
  );
  const lIsReachable = pPath.length > 1;

  if (lIndexExistingReachable > -1) {
    lReachables[lIndexExistingReachable].value =
      lReachables[lIndexExistingReachable].value || lIsReachable;
    return lReachables;
  } else {
    return lReachables.concat({
      value: lIsReachable,
      asDefinedInRule: pRule.name || "not-in-allowed"
    });
  }
}

function mergeReachesProperties(pFromModule, pToModule, pRule, pPath) {
  const lReaches = pFromModule.reaches || [];
  const lIndexExistingReachable = lReaches.findIndex(
    pReachable =>
      pReachable.asDefinedInRule === (pRule.name || "not-in-allowed")
  );

  if (lIndexExistingReachable > -1) {
    lReaches[lIndexExistingReachable].modules = (
      lReaches[lIndexExistingReachable].modules ||
      // eslint-disable-next-line no-inline-comments
      /* istanbul ignore next: 'modules' is a mandatory attribute so shouldn't
       * happen it doesn't exist, but defensive default here nonetheless
       */

      []
    ).concat({
      source: pToModule.source,
      via: pPath
    });
    return lReaches;
  } else {
    return lReaches.concat({
      asDefinedInRule: pRule.name || "not-in-allowed",
      modules: [{ source: pToModule.source, via: pPath }]
    });
  }
}

// TODO function is a bit on the big side - time to split it
function addReachableToGraph(pGraph, pReachableRule) {
  return pGraph.map(pModule => {
    let lReturnValue = _clone(pModule);

    if (
      pReachableRule.to.reachable === true &&
      isModuleInRuleFrom(pReachableRule)(lReturnValue)
    ) {
      pGraph.filter(isModuleInRuleTo(pReachableRule)).forEach(pToModule => {
        if (lReturnValue.source !== pToModule.source) {
          const lPath = getPath(pGraph, pModule.source, pToModule.source);

          if (lPath.length > 0) {
            lReturnValue.reaches = mergeReachesProperties(
              lReturnValue,
              pToModule,
              pReachableRule,
              lPath
            );
          }
        }
      });
    }
    if (isModuleInRuleTo(pReachableRule)(lReturnValue)) {
      pGraph
        .filter(isModuleInRuleFrom(pReachableRule))
        .forEach(pLFromModule => {
          lReturnValue.reachable = mergeReachableProperties(
            lReturnValue,
            pReachableRule,
            getPath(pGraph, pLFromModule.source, pModule.source)
          );
        });
    }
    return lReturnValue;
  });
}

module.exports = (pGraph, pRuleSet) => {
  const lReachableRules = pRuleSet ? getReachableRules(pRuleSet) : [];

  return lReachableRules.reduce(
    (pReturnGraph, pRule) => addReachableToGraph(pReturnGraph, pRule),
    _clone(pGraph)
  );
};
