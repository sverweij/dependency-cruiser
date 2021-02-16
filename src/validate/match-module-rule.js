const _has = require("lodash/has");
const isModuleOnlyRule = require("./is-module-only-rule");
const matchers = require("./matchers");
const { extractGroups } = require("./utl");

function matchesOrphanRule(pRule, pModule) {
  return (
    _has(pRule.from, "orphan") &&
    pModule.orphan === pRule.from.orphan &&
    matchers.fromPath(pRule, pModule) &&
    matchers.fromPathNot(pRule, pModule)
  );
}

function matchesReachableRule(pRule, pModule) {
  if (_has(pRule.to, "reachable") && _has(pModule, "reachable")) {
    const lReachableRecord = pModule.reachable.find(
      (pReachable) =>
        pReachable.asDefinedInRule === pRule.name &&
        pReachable.value === pRule.to.reachable
    );
    if (Boolean(lReachableRecord)) {
      const lGroups = extractGroups(pRule.from, lReachableRecord.matchedFrom);

      return (
        matchers.toModulePath(pRule, pModule, lGroups) &&
        matchers.toModulePathNot(pRule, pModule, lGroups)
      );
    }
  }
  return false;
}

function matchesReachesRule(pRule, pModule) {
  return (
    _has(pRule.to, "reachable") &&
    _has(pModule, "reaches") &&
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
  return (pRule) => {
    return (
      matchesOrphanRule(pRule, pModule) ||
      matchesReachableRule(pRule, pModule) ||
      matchesReachesRule(pRule, pModule)
    );
  };
}
const isInteresting = (pRule) => isModuleOnlyRule(pRule);

module.exports = {
  matchesOrphanRule,
  matchesReachableRule,
  matchesReachesRule,
  match,
  isInteresting,
};
