const isModuleOnlyRule = require("./is-module-only-rule");
const matchers = require("./matchers");

function matchesOrphanRule(pRule, pModule) {
  return (
    Object.prototype.hasOwnProperty.call(pRule.from, "orphan") &&
    Object.prototype.hasOwnProperty.call(pModule, "orphan") &&
    pModule.orphan === pRule.from.orphan &&
    matchers.fromPath(pRule, pModule) &&
    matchers.fromPathNot(pRule, pModule)
  );
}

function matchesReachableRule(pRule, pModule) {
  return (
    Object.prototype.hasOwnProperty.call(pRule.to, "reachable") &&
    Object.prototype.hasOwnProperty.call(pModule, "reachable") &&
    pModule.reachable.some(
      (pReachable) =>
        pReachable.asDefinedInRule === pRule.name &&
        pReachable.value === pRule.to.reachable
    ) &&
    matchers.toModulePath(pRule, pModule) &&
    matchers.toModulePathNot(pRule, pModule)
  );
}

function matchesReachesRule(pRule, pModule) {
  return (
    Object.prototype.hasOwnProperty.call(pRule.to, "reachable") &&
    Object.prototype.hasOwnProperty.call(pModule, "reaches") &&
    pModule.reaches.some(
      (pReaches) =>
        pReaches.asDefinedInRule === pRule.name &&
        pReaches.modules.some(
          (pReachesModule) =>
            matchers.toModulePath(pRule, pReachesModule) &&
            matchers.toModulePathNot(pRule, pReachesModule)
        )
    )
  );
}

function match(pModule) {
  return (pRule) =>
    matchesOrphanRule(pRule, pModule) ||
    matchesReachableRule(pRule, pModule) ||
    matchesReachesRule(pRule, pModule);
}
const isInteresting = (pRule) => isModuleOnlyRule(pRule);

module.exports = {
  matchesOrphanRule,
  matchesReachableRule,
  matchesReachesRule,
  match,
  isInteresting,
};
