/* eslint-disable security/detect-object-injection */

const _clone = require("lodash/clone");
const _get = require("lodash/get");
const _has = require("lodash/has");
const matchers = require("../../../validate/matchers");
const { extractGroups } = require("../../../validate/utl");
const getPath = require("./get-path");

function getReachableRules(pRuleSet) {
  return _get(pRuleSet, "forbidden", [])
    .filter((pRule) => _has(pRule.to, "reachable"))
    .concat(
      _get(pRuleSet, "allowed", []).filter((pRule) =>
        _has(pRule.to, "reachable")
      )
    );
}

function isModuleInRuleFrom(pRule) {
  return (pModule) =>
    (!pRule.from.path || pModule.source.match(pRule.from.path)) &&
    (!pRule.from.pathNot || !pModule.source.match(pRule.from.pathNot));
}

function isModuleInRuleTo(pRule, pModuleTo, pModuleFrom) {
  const lGroups = pModuleFrom
    ? extractGroups(pRule.from, pModuleFrom.source)
    : [];

  return (
    matchers.toModulePath(pRule, pModuleTo, lGroups) &&
    matchers.toModulePathNot(pRule, pModuleTo, lGroups)
  );
}

function mergeReachableProperties(pModule, pRule, pPath, pModuleFrom) {
  const lReachables = pModule.reachable || [];
  const lIndexExistingReachable = lReachables.findIndex(
    (pReachable) => pReachable.asDefinedInRule === pRule.name
  );
  const lIsReachable = pPath.length > 1;

  if (lIndexExistingReachable > -1) {
    lReachables[lIndexExistingReachable].value =
      lReachables[lIndexExistingReachable].value || lIsReachable;
    return lReachables;
  } else {
    return lReachables.concat({
      value: lIsReachable,
      asDefinedInRule: pRule.name,
      matchedFrom: pModuleFrom,
    });
  }
}

function mergeReachesProperties(pFromModule, pToModule, pRule, pPath) {
  const lReaches = pFromModule.reaches || [];
  const lIndexExistingReachable = lReaches.findIndex(
    (pReachable) => pReachable.asDefinedInRule === pRule.name
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
      via: pPath,
    });
    return lReaches;
  } else {
    return lReaches.concat({
      asDefinedInRule: pRule.name,
      modules: [{ source: pToModule.source, via: pPath }],
    });
  }
}

function shouldAddReaches(pRule, pModule) {
  return (
    (pRule.to.reachable === true || pRule.name === "not-in-allowed") &&
    isModuleInRuleFrom(pRule)(pModule)
  );
}

function hasCapturingGroups(pRule) {
  const lCapturingGroupPlaceholderRe = "\\$[0-9]+";

  return Boolean(
    _get(pRule, "to.path", "").match(lCapturingGroupPlaceholderRe) ||
      _get(pRule, "to.pathNot", "").match(lCapturingGroupPlaceholderRe)
  );
}
function shouldAddReachable(pRule, pModuleTo, pGraph) {
  let lReturnValue = false;

  if (pRule.to.reachable === false || pRule.name === "not-in-allowed") {
    if (hasCapturingGroups(pRule)) {
      const lModulesFrom = pGraph.filter(isModuleInRuleFrom(pRule));

      lReturnValue = lModulesFrom.some((pModuleFrom) =>
        isModuleInRuleTo(pRule, pModuleTo, pModuleFrom)
      );
    } else {
      lReturnValue = isModuleInRuleTo(pRule, pModuleTo);
    }
  }
  return lReturnValue;
}

function addReachesToModule(pModule, pGraph, pReachableRule) {
  const lToModules = pGraph.filter((pToModule) =>
    isModuleInRuleTo(pReachableRule, pToModule, pModule)
  );

  for (let lToModule of lToModules) {
    if (pModule.source !== lToModule.source) {
      const lPath = getPath(pGraph, pModule.source, lToModule.source);

      if (lPath.length > 0) {
        pModule.reaches = mergeReachesProperties(
          pModule,
          lToModule,
          pReachableRule,
          lPath
        );
      }
    }
  }
  return pModule;
}

function addReachableToModule(pModule, pGraph, pReachableRule) {
  const lFromModules = pGraph.filter(isModuleInRuleFrom(pReachableRule));
  let lFound = false;

  for (let lFromModule of lFromModules) {
    if (
      !lFound &&
      pModule.source !== lFromModule.source &&
      isModuleInRuleTo(pReachableRule, pModule, lFromModule)
    ) {
      const lPath = getPath(pGraph, lFromModule.source, pModule.source);

      lFound = lPath.length > 0;
      pModule.reachable = mergeReachableProperties(
        pModule,
        pReachableRule,
        lPath,
        lFromModule.source
      );
    }
  }
  return pModule;
}

function addReachabilityToGraph(pGraph, pReachableRule) {
  return pGraph.map((pModule) => {
    let lClonedModule = _clone(pModule);

    if (shouldAddReaches(pReachableRule, lClonedModule)) {
      lClonedModule = addReachesToModule(lClonedModule, pGraph, pReachableRule);
    }
    if (shouldAddReachable(pReachableRule, lClonedModule, pGraph)) {
      lClonedModule = addReachableToModule(
        lClonedModule,
        pGraph,
        pReachableRule
      );
    }
    return lClonedModule;
  });
}

module.exports = (pGraph, pRuleSet) => {
  const lReachableRules = pRuleSet ? getReachableRules(pRuleSet) : [];

  return lReachableRules.reduce(
    (pReturnGraph, pRule) => addReachabilityToGraph(pReturnGraph, pRule),
    _clone(pGraph)
  );
};
