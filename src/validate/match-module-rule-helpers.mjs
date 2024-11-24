import {
  matchToModulePath,
  matchToModulePathNot,
  matchesFromPath,
  matchesFromPathNot,
  matchesModulePath,
  matchesModulePathNot,
} from "./matchers.mjs";
import { extractGroups } from "#utl/regex-util.mjs";

/**
 * @import { IModule } from "../../types/cruise-result.mjs";
 * @import { IAnyRuleType } from "../../types/rule-set.mjs";
 */

/**
 * Returns true if pRule is an orphan rule and pModule is an orphan.
 * Returns false in all other cases
 *
 * @param {IAnyRuleType} pRule
 * @param {IModule} pModule
 * @returns {boolean}
 */
export function matchesOrphanRule(pRule, pModule) {
  return (
    Object.hasOwn(pRule?.from ?? {}, "orphan") &&
    // @ts-expect-error the 'hasOwn' above guarantees there's a 'from.orphan' attribute
    pModule.orphan === pRule.from.orphan &&
    matchesFromPath(pRule, pModule) &&
    matchesFromPathNot(pRule, pModule)
  );
}

/**
 * Returns true if pRule is a 'reachable' rule and pModule matches the reachability
 * criteria.
 * Returns false in all other cases
 *
 * @param {IAnyRuleType} pRule
 * @param {IModule} pModule
 * @returns {boolean}
 */
export function matchesReachableRule(pRule, pModule) {
  if (
    Object.hasOwn(pRule?.to ?? {}, "reachable") &&
    Object.hasOwn(pModule, "reachable")
  ) {
    // @ts-expect-error the 'hasOwn' above ensures the 'reachable' exists
    const lReachableRecord = pModule.reachable.find(
      (pReachable) =>
        pReachable.asDefinedInRule === pRule.name &&
        // @ts-expect-error the 'hasOwn' above ensures the 'to.reachable' exists
        pReachable.value === pRule.to.reachable,
    );
    if (lReachableRecord) {
      const lGroups = extractGroups(pRule.from, lReachableRecord.matchedFrom);

      return (
        matchToModulePath(pRule, pModule, lGroups) &&
        matchToModulePathNot(pRule, pModule, lGroups)
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
 * @param {IAnyRuleType} pRule
 * @param {IModule} pModule
 * @returns {boolean}
 */
export function matchesReachesRule(pRule, pModule) {
  return (
    Object.hasOwn(pRule?.to ?? {}, "reachable") &&
    Object.hasOwn(pModule, "reaches") &&
    // @ts-expect-error the 'hasOwn' above guarantees the .reaches exists
    pModule.reaches.some(
      (pReaches) =>
        pReaches.asDefinedInRule === pRule.name &&
        pReaches.modules.some(
          (pReachesModule) =>
            matchToModulePath(pRule, pReachesModule) &&
            matchToModulePathNot(pRule, pReachesModule),
        ),
    )
  );
}
/**
 *
 * @param {IAnyRuleType} pRule
 * @param {string[]} pDependents
 * @returns {boolean}
 */
function dependentsCountsMatch(pRule, pDependents) {
  const lMatchingDependentsCount = pDependents.filter(
    (pDependent) =>
      Boolean(!pRule.from.path || pDependent.match(pRule.from.path)) &&
      Boolean(!pRule.from.pathNot || !pDependent.match(pRule.from.pathNot)),
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
 * @param {IAnyRuleType} pRule
 * @param {IModule} pModule
 * @returns {boolean}
 */

export function matchesDependentsRule(pRule, pModule) {
  if (
    (Object.hasOwn(pModule, "dependents") &&
      Object.hasOwn(pRule?.module ?? {}, "numberOfDependentsLessThan")) ||
    Object.hasOwn(pRule?.module ?? {}, "numberOfDependentsMoreThan")
  ) {
    return (
      // group matching seems like a nice idea, however, the 'from' part of the
      // rule is going to match not one module (as with regular dependency rules)
      // but a whole bunch of them, being the 'dependents'. So that match is going
      // to produce not one result, but one per matching dependent. To get meaningful
      // results we'd probably have to loop over these and or the
      // matchToModulePath together.
      matchesModulePath(pRule, pModule) &&
      matchesModulePathNot(pRule, pModule) &&
      dependentsCountsMatch(pRule, pModule.dependents)
    );
  }
  return false;
}
