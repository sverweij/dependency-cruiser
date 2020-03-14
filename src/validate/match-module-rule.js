const isModuleOnlyRule = require("./is-module-only-rule");
const matches = require("./matches");

function matchesOrphanRule(pRule, pModule) {
  let lReturnValue = true;

  if (pRule.from.hasOwnProperty("orphan")) {
    if (pModule.hasOwnProperty("orphan")) {
      lReturnValue =
        pModule.orphan === pRule.from.orphan &&
        matches.fromPath(pRule, pModule) &&
        matches.fromPathNot(pRule, pModule);
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
        matches.toModulePath(pRule, pModule) &&
        matches.toModulePathNot(pRule, pModule);
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
