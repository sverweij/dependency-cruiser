import isOrphan from "./is-orphan.mjs";
import ModuleGraphWithDependencySet from "#graph-utl/module-graph-with-dependency-set.mjs";

/** @import { IFlattenedRuleSet } from "../../../../types/rule-set.mjs" */

function isOrphanRule(pRule) {
  return (
    /* c8 ignore start */
    Object.hasOwn(pRule?.from ?? {}, "orphan")
    /* c8 ignore stop */
  );
}
/**
 * @param {IFlattenedRuleSet} pRuleSet
 * @returns {boolean}
 */
export function hasOrphanRule(pRuleSet) {
  return (
    (pRuleSet?.forbidden ?? []).some(isOrphanRule) ||
    (pRuleSet?.allowed ?? []).some(isOrphanRule)
  );
}

export default function deriveOrphans(
  pModules,
  { skipAnalysisNotInRules, ruleSet },
) {
  if (!skipAnalysisNotInRules || hasOrphanRule(ruleSet)) {
    // just like the dependents derivation, creating this data structure
    // might seem overkill, but it can save effort here as well, even though
    // isOrphan has early exits the dependents derivation doesn't:
    // - when the module already has dependencies (quick length check)
    // - when dependents are already calculated (quick length check as well). If
    //   they are the  lModulesWithDependencySet is created for naught.
    const lModulesWithDependencySet = new ModuleGraphWithDependencySet(
      pModules,
    );

    return pModules.map((pModule) => ({
      ...pModule,
      orphan: isOrphan(pModule, lModulesWithDependencySet),
    }));
  }
  return pModules;
}
