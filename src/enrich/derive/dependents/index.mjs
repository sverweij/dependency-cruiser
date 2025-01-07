import getDependents from "./get-dependents.mjs";

/** @import { IFlattenedRuleSet } from "../../../../types/rule-set.mjs" */

function isDependentsRule(pRule) {
  // used in folder rules and when moreUnstable is in the 'to' => governed by
  // the 'metrics' flag in options, sot not going to repeat that here

  // dependents are used in the orphans analsys. hHwever, there is a fall back
  // where it does its own analysis, so not going to repeat that check here.
  return (
    /* c8 ignore start */
    Object.hasOwn(pRule?.module ?? {}, "numberOfDependentsLessThan") ||
    Object.hasOwn(pRule?.module ?? {}, "numberOfDependentsMoreThan")
    /* c8 ignore stop */
  );
}

/**
 * @param {IFlattenedRuleSet} pRuleSet
 * @returns {boolean}
 */
export function hasDependentsRule(pRuleSet) {
  return (
    (pRuleSet?.forbidden ?? []).some(isDependentsRule) ||
    (pRuleSet?.allowed ?? []).some(isDependentsRule)
  );
}

export default function addDependents(
  pModules,
  { skipAnalysisNotInRules, metrics, ruleSet },
) {
  if (!skipAnalysisNotInRules || metrics || hasDependentsRule(ruleSet)) {
    return pModules.map((pModule) => ({
      ...pModule,
      dependents: getDependents(pModule, pModules),
    }));
  }
  return pModules;
}
