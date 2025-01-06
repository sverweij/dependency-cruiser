import isOrphan from "./is-orphan.mjs";

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
    return pModules.map((pModule) => ({
      ...pModule,
      orphan: isOrphan(pModule, pModules),
    }));
  }
  return pModules;
}
