import has from "lodash/has.js";
import { extractGroups } from "../utl/regex-util.mjs";
import { isModuleOnlyRule, isFolderScope } from "./rule-classifiers.mjs";
import matchers from "./matchers.mjs";

/**
 * Returns true if pRule is an orphan rule and pModule is an orphan.
 * Returns false in all other cases
 *
 * @param {import("../../types/rule-set.js").IAnyRuleType} pRule
 * @param {import("../../types/cruise-result.js").IModule} pModule
 * @returns {boolean}
 */
function matchesOrphanRule(pRule, pModule) {
  return (
    has(pRule, "from.orphan") &&
    // @ts-expect-error the 'has' above guarantees there's a 'from.orphan' attribute
    pModule.orphan === pRule.from.orphan &&
    matchers.fromPath(pRule, pModule) &&
    matchers.fromPathNot(pRule, pModule)
  );
}

/**
 * Returns true if pRule is a 'reachable' rule and pModule matches the reachability
 * criteria.
 * Returns false in all other cases
 *
 * @param {import("../../types/rule-set.js").IAnyRuleType} pRule
 * @param {import("../../types/cruise-result.js").IModule} pModule
 * @returns {boolean}
 */
function matchesReachableRule(pRule, pModule) {
  if (has(pRule, "to.reachable") && has(pModule, "reachable")) {
    // @ts-expect-error the 'has' above ensures the 'reachable' exists
    const lReachableRecord = pModule.reachable.find(
      (pReachable) =>
        pReachable.asDefinedInRule === pRule.name &&
        // @ts-expect-error the 'has' above ensures the 'to.reachable' exists
        pReachable.value === pRule.to.reachable
    );
    if (lReachableRecord) {
      const lGroups = extractGroups(pRule.from, lReachableRecord.matchedFrom);

      return (
        matchers.toModulePath(pRule, pModule, lGroups) &&
        matchers.toModulePathNot(pRule, pModule, lGroups)
      );
    }
  }
  return false;
}

/**
 * Returns true if pRule is a 'reaches' rule and pModule matches the reachability
 * criteria.
 * Returns false in all other cases
 *
 * @param {import("../../types/rule-set.js").IAnyRuleType} pRule
 * @param {import("../../types/cruise-result.js").IModule} pModule
 * @returns {boolean}
 */
function matchesReachesRule(pRule, pModule) {
  return (
    has(pRule, "to.reachable") &&
    has(pModule, "reaches") &&
    // @ts-expect-error the 'has' above guarantees the .reaches exists
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
/**
 *
 * @param {import("../../types/rule-set.js").IAnyRuleType} pRule
 * @param {string[]} pDependents
 * @returns {boolean}
 */
function dependentsCountsMatch(pRule, pDependents) {
  const lMatchingDependentsCount = pDependents.filter(
    (pDependent) =>
      Boolean(!pRule.from.path || pDependent.match(pRule.from.path)) &&
      Boolean(!pRule.from.pathNot || !pDependent.match(pRule.from.pathNot))
  ).length;
  return (
    (!pRule.module.numberOfDependentsLessThan ||
      lMatchingDependentsCount < pRule.module.numberOfDependentsLessThan) &&
    (!pRule.module.numberOfDependentsMoreThan ||
      lMatchingDependentsCount > pRule.module.numberOfDependentsMoreThan)
  );
}

/**
 *
 * @param {import("../../types/rule-set.js").IAnyRuleType} pRule
 * @param {import("../../types/cruise-result.js").IModule} pModule
 * @returns {boolean}
 */
function matchesDependentsRule(pRule, pModule) {
  if (
    (has(pModule, "dependents") &&
      has(pRule, "module.numberOfDependentsLessThan")) ||
    has(pRule, "module.numberOfDependentsMoreThan")
  ) {
    return (
      // group matching seems like a nice idea, however, the 'from' part of the
      // rule is going to match not one module (as with regular dependency rules)
      // but a whole bunch of them, being the 'dependents'. So that match is going
      // to produce not one result, but one per matching dependent. To get meaningful
      // results we'd probably have to loop over these and or the
      // matchers.toModulePath together.
      matchers.modulePath(pRule, pModule) &&
      matchers.modulePathNot(pRule, pModule) &&
      dependentsCountsMatch(pRule, pModule.dependents)
    );
  }
  return false;
}

/**
 *
 * @param {import("../../types/cruise-result.js").IModule} pModule
 * @returns {(pRule:import("../../types/rule-set.js").IAnyRuleType) => boolean}
 */
function match(pModule) {
  return (pRule) =>
    matchesOrphanRule(pRule, pModule) ||
    matchesReachableRule(pRule, pModule) ||
    matchesReachesRule(pRule, pModule) ||
    matchesDependentsRule(pRule, pModule);
}

/**
 *
 * @param {import("../../types/rule-set.js").IAnyRuleType} pRule
 * @returns boolean
 */
const isInteresting = (pRule) =>
  isModuleOnlyRule(pRule) && !isFolderScope(pRule);

export default {
  matchesOrphanRule,
  matchesReachableRule,
  matchesReachesRule,
  matchesDependentsRule,
  match,
  isInteresting,
};
