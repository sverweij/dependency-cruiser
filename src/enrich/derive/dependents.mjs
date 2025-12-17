/** @import { IFlattenedRuleSet } from "../../../types/rule-set.mjs" */

function isDependentsRule(pRule) {
  // used in folder rules and when moreUnstable is in the 'to' => governed by
  // the 'metrics' flag in options, sot not going to repeat that here

  // dependents are used in the orphans analsys. However, there is a fall back
  // where it does its own analysis which is faster on itself, so not going
  // to repeat that check here either.
  return (
    /* c8 ignore start */
    Object.hasOwn(pRule?.module ?? {}, "numberOfDependentsLessThan") ||
    Object.hasOwn(pRule?.module ?? {}, "numberOfDependentsMoreThan")
    /* c8 ignore stop */
  );
}

export function getDependents(pModule, pModulesWithDependencySet) {
  // perf between O(n) in an unconnected graph and O(n^2) in a fully connected one
  return pModulesWithDependencySet
    .filter(({ dependencies }) => dependencies.has(pModule.source))
    .map((pDependentModule) => pDependentModule.source);
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
    // creating this optimized structure here might seem overkill, but on
    // large graphs it pays off significantly - creation is a few centiseconds
    // but it cuts analysis in half on large graphs (and even on smaller
    // graphs it's a win, even though just a few milliseconds)
    const lModulesWithDependencySet = pModules.map((pModule) => ({
      source: pModule.source,
      dependencies: new Set(
        pModule.dependencies.map((pDependency) => pDependency.resolved),
      ),
    }));
    return pModules.map((pModule) => ({
      ...pModule,
      dependents: getDependents(pModule, lModulesWithDependencySet),
    }));
  }
  return pModules;
}
