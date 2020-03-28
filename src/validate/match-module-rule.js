const isModuleOnlyRule = require("./is-module-only-rule");
const matchers = require("./matchers");

function matchesOrphanRule(pRule, pModule) {
  let lReturnValue = true;

  if (pRule.from.hasOwnProperty("orphan")) {
    if (pModule.hasOwnProperty("orphan")) {
      lReturnValue =
        pModule.orphan === pRule.from.orphan &&
        matchers.fromPath(pRule, pModule) &&
        matchers.fromPathNot(pRule, pModule);
    } else {
      lReturnValue = !pRule.from.orphan;
    }
  }
  return lReturnValue;
}

function matchesReachableRule(pRule, pModule) {
  let lReturnValue = true;

  if (pRule.to.hasOwnProperty("reachable")) {
    lReturnValue = pRule.to.reachable;
    if (pModule.hasOwnProperty("reachable")) {
      lReturnValue =
        pModule.reachable.some(
          pReachable =>
            pReachable.asDefinedInRule === (pRule.name || "not-in-allowed") &&
            pRule.to.reachable === pReachable.value
        ) &&
        matchers.toModulePath(pRule, pModule) &&
        matchers.toModulePathNot(pRule, pModule);
    }
  }
  return lReturnValue;
}

function match(pModule) {
  return pRule =>
    matchesOrphanRule(pRule, pModule) && matchesReachableRule(pRule, pModule);
}
const isInteresting = pRule => isModuleOnlyRule(pRule);

module.exports = {
  match,
  isInteresting
};
