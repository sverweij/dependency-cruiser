import isOrphan from "./is-orphan.mjs";

/** @import { IFlattenedRuleSet } from "../../../../types/rule-set.mjs" */
/**
 * @param {IFlattenedRuleSet} pRuleSet
 * @returns {boolean}
 */
export function hasOrphanRule(pRuleSet) {
  return (
    (pRuleSet?.forbidden ?? []).some(
      (pRule) =>
        /* c8 ignore start */
        Object.hasOwn(pRule?.from ?? {}, "orphan"),
      /* c8 ignore stop */
    ) ||
    (pRuleSet?.allowed ?? []).some(
      (pRule) =>
        /* c8 ignore start */
        Object.hasOwn(pRule?.from ?? {}, "orphan"),
      /* c8 ignore stop */
    )
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
