const isModuleOnlyRule = require("./is-module-only-rule");
const matchers = require("./matchers");

function matchesOrphanRule(pRule, pModule) {
  return (
    pRule.from.hasOwnProperty("orphan") &&
    pModule.hasOwnProperty("orphan") &&
    pModule.orphan === pRule.from.orphan &&
    matchers.fromPath(pRule, pModule) &&
    matchers.fromPathNot(pRule, pModule)
  );
}

function matchesReachableRule(pRule, pModule) {
  return (
    pRule.to.hasOwnProperty("reachable") &&
    pModule.hasOwnProperty("reachable") &&
    pModule.reachable.some(
      pReachable =>
        pReachable.asDefinedInRule === (pRule.name || "not-in-allowed") &&
        pReachable.value === pRule.to.reachable
    ) &&
    matchers.toModulePath(pRule, pModule) &&
    matchers.toModulePathNot(pRule, pModule)
  );
}

function match(pModule) {
  return pRule =>
    matchesOrphanRule(pRule, pModule) || matchesReachableRule(pRule, pModule);
}
const isInteresting = pRule => isModuleOnlyRule(pRule);

module.exports = {
  matchesOrphanRule,
  matchesReachableRule,
  match,
  isInteresting
};
