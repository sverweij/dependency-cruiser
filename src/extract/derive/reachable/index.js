/* eslint-disable security/detect-object-injection */
/* eslint-disable complexity */
/* eslint-disable max-lines-per-function */
const _clone = require("lodash/clone");
const _get = require("lodash/get");
const isReachable = require("./is-reachable");

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
function mergeReachableProperties(pModule, pRule, pIsReachable) {
  const lReachables = pModule.reachable || [];
  const lIndexExistingReachable = lReachables.findIndex(
    pReachable => pReachable.asDefinedInRule === pRule.name || "not-in-allowed"
  );

  if (lIndexExistingReachable > -1) {
    lReachables[lIndexExistingReachable].value =
      lReachables[lIndexExistingReachable].value || pIsReachable;
    return lReachables;
  } else {
    return lReachables.concat({
      value: pIsReachable,
      asDefinedInRule: pRule.name || "not-in-allowed"
    });
  }
}

function mergeReachesProperties(pFromModule, pToModule, pRule) {
  const lReaches = pFromModule.reaches || [];
  const lIndexExistingReachable = lReaches.findIndex(
    pReachable => pReachable.asDefinedInRule === pRule.name || "not-in-allowed"
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
      source: pToModule.source
    });
    return lReaches;
  } else {
    return lReaches.concat({
      asDefinedInRule: pRule.name || "not-in-allowed",
      modules: [{ source: pToModule.source }]
    });
  }
}

function addReachableToGraph(pGraph, pReachableRule) {
  const lFromModules = pGraph.filter(isModuleInRuleFrom(pReachableRule));
  const lToModules = pGraph.filter(isModuleInRuleTo(pReachableRule));

  return pGraph.map(pModule => {
    let lReturnValue = _clone(pModule);

    if (
      pReachableRule.to.reachable === true &&
      isModuleInRuleFrom(pReachableRule)(lReturnValue)
    ) {
      for (const lToModule of lToModules) {
        if (
          lReturnValue.source !== lToModule.source &&
          isReachable(pGraph, pModule.source, lToModule.source)
        ) {
          lReturnValue.reaches = mergeReachesProperties(
            lReturnValue,
            lToModule,
            pReachableRule
          );
        }
      }
    }
    if (isModuleInRuleTo(pReachableRule)(lReturnValue)) {
      for (const lFromModule of lFromModules) {
        lReturnValue.reachable = mergeReachableProperties(
          lReturnValue,
          pReachableRule,
          isReachable(pGraph, lFromModule.source, pModule.source)
        );
      }
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
