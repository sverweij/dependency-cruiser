/* eslint-disable security/detect-object-injection, no-inline-comments */
import {
  matchToModulePath,
  matchToModulePathNot,
} from "#validate/matchers.mjs";
import IndexedModuleGraph from "#graph-utl/indexed-module-graph.mjs";
import { extractGroups } from "#utl/regex-util.mjs";

function isReachableRule(pRule) {
  return Object.hasOwn(pRule?.to ?? {}, "reachable");
}

function getReachableRules(pRuleSet) {
  return (pRuleSet?.forbidden ?? [])
    .filter(isReachableRule)
    .concat((pRuleSet?.allowed ?? []).filter(isReachableRule))
    .concat((pRuleSet?.required ?? []).filter(isReachableRule));
}

function isModuleInRuleFrom(pRule) {
  return (pModule) => {
    const lRuleFrom = pRule.from ?? pRule.module;
    if (lRuleFrom) {
      return (
        (!lRuleFrom.path || pModule.source.match(lRuleFrom.path)) &&
        (!lRuleFrom.pathNot || !pModule.source.match(lRuleFrom.pathNot))
      );
    }
    return false;
  };
}

function isModuleInRuleTo(pRule, pModuleTo, pModuleFrom) {
  const lGroups = pModuleFrom
    ? extractGroups(pRule.from ?? pRule.module, pModuleFrom.source)
    : [];

  return (
    matchToModulePath(pRule, pModuleTo, lGroups) &&
    matchToModulePathNot(pRule, pModuleTo, lGroups)
  );
}

function mergeReachableProperties(pModule, pRule, pPath, pModuleFrom) {
  const lReachables = pModule.reachable || [];
  const lIndexExistingReachable = lReachables.findIndex(
    (pReachable) => pReachable.asDefinedInRule === pRule.name,
  );
  const lIsReachable = pPath.length > 0;

  if (lIndexExistingReachable > -1) {
    lReachables[lIndexExistingReachable].value =
      lReachables[lIndexExistingReachable].value || lIsReachable;
    return lReachables;
  }
  return lReachables.concat({
    value: lIsReachable,
    asDefinedInRule: pRule.name,
    matchedFrom: pModuleFrom,
  });
}

function mergeReachesProperties(pFromModule, pToModule, pRule, pPath) {
  const lReaches = pFromModule.reaches || [];
  const lIndexExistingReachable = lReaches.findIndex(
    (pReachable) => pReachable.asDefinedInRule === pRule.name,
  );

  if (lIndexExistingReachable > -1) {
    lReaches[lIndexExistingReachable].modules = (
      lReaches[lIndexExistingReachable].modules /* c8 ignore next */ || []
    ).concat({
      source: pToModule.source,
      via: pPath,
    });
    return lReaches;
  }
  return lReaches.concat({
    asDefinedInRule: pRule.name,
    modules: [{ source: pToModule.source, via: pPath }],
  });
}

function shouldAddReaches(pRule, pModule) {
  return (
    (pRule.to.reachable === true || pRule.name === "not-in-allowed") &&
    isModuleInRuleFrom(pRule)(pModule)
  );
}

function hasCapturingGroups(pRule) {
  const lCapturingGroupPlaceholderRe = /\$[0-9]+/;

  return (
    lCapturingGroupPlaceholderRe.test(pRule?.to?.path ?? "") ||
    lCapturingGroupPlaceholderRe.test(pRule?.to?.pathNot ?? "")
  );
}
function shouldAddReachable(pRule, pModuleTo, pGraph) {
  let lReturnValue = false;

  if (
    pRule.to.reachable === false ||
    pRule.name === "not-in-allowed" ||
    pRule.module
  ) {
    if (hasCapturingGroups(pRule)) {
      const lModulesFrom = pGraph.filter(isModuleInRuleFrom(pRule));

      lReturnValue = lModulesFrom.some((pModuleFrom) =>
        isModuleInRuleTo(pRule, pModuleTo, pModuleFrom),
      );
    } else {
      lReturnValue = isModuleInRuleTo(pRule, pModuleTo);
    }
  }
  return lReturnValue;
}

function addReachesToModule(pModule, pGraph, pIndexedGraph, pReachableRule) {
  const lToModules = pGraph.filter((pToModule) =>
    isModuleInRuleTo(pReachableRule, pToModule, pModule),
  );

  for (let lToModule of lToModules) {
    if (pModule.source !== lToModule.source) {
      const lPath = pIndexedGraph.getPath(pModule.source, lToModule.source);

      if (lPath.length > 0) {
        pModule.reaches = mergeReachesProperties(
          pModule,
          lToModule,
          pReachableRule,
          lPath,
        );
      }
    }
  }
  return pModule;
}

function addReachableToModule(
  pModule,
  pIndexedGraph,
  pReachableRule,
  pFilteredFromModules,
) {
  let lFound = false;

  for (let lFromModule of pFilteredFromModules) {
    if (
      !lFound &&
      pModule.source !== lFromModule.source &&
      isModuleInRuleTo(pReachableRule, pModule, lFromModule)
    ) {
      const lPath = pIndexedGraph.getPath(lFromModule.source, pModule.source);

      lFound = lPath.length > 0;
      pModule.reachable = mergeReachableProperties(
        pModule,
        pReachableRule,
        lPath,
        lFromModule.source,
      );
    }
  }
  return pModule;
}

function addReachabilityToGraph(pGraph, pIndexedGraph, pReachableRule) {
  const lFromModules = pGraph.filter(isModuleInRuleFrom(pReachableRule));

  return pGraph.map((pModule) => {
    let lClonedModule = structuredClone(pModule);

    if (shouldAddReaches(pReachableRule, lClonedModule)) {
      lClonedModule = addReachesToModule(
        lClonedModule,
        pGraph,
        pIndexedGraph,
        pReachableRule,
      );
    }
    if (shouldAddReachable(pReachableRule, lClonedModule, pGraph)) {
      lClonedModule = addReachableToModule(
        lClonedModule,
        pIndexedGraph,
        pReachableRule,
        lFromModules,
      );
    }
    return lClonedModule;
  });
}

export default function deriveReachables(pGraph, pRuleSet) {
  const lReachableRules = pRuleSet ? getReachableRules(pRuleSet) : [];

  if (lReachableRules.length > 0) {
    const lIndexedGraph = new IndexedModuleGraph(pGraph);

    return lReachableRules.reduce(
      (pReturnGraph, pRule) =>
        addReachabilityToGraph(pReturnGraph, lIndexedGraph, pRule),
      structuredClone(pGraph),
    );
  }
  return pGraph;
}
