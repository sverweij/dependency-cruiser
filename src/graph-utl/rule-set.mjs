import has from "lodash/has.js";

/**
 * Finds the first rule in the rule set that has name pName,
 * and undefined if no such rule exists/ the rule is an 'allowed'
 * rule.
 *
 * (this thing probably belongs in a model-like folder and not in utl)
 *
 * @param {import("../../types/dependency-cruiser").IFlattenedRuleSet} pRuleSet - The rule set to search in
 * @param {string} pName - The rule name to look for
 * @return {import("../../types/rule-set").IForbiddenRuleType|undefined} - a rule (or 'undefined' if nothing found)
 */
export function findRuleByName(pRuleSet, pName) {
  return (pRuleSet?.forbidden ?? []).find(
    (pForbiddenRule) => pForbiddenRule.name === pName
  );
}

/**
 * Returns true if the rule set has a rule that uses the 'license' or
 * 'licenseNot' attribute.
 *
 * Returns false in all other cases
 *
 * @param {import('../../types/dependency-cruiser').IFlattenedRuleSet} pRuleSet
 * @return {boolean}
 */
export function ruleSetHasLicenseRule(pRuleSet) {
  return (
    (pRuleSet?.forbidden ?? []).some(
      (pRule) => has(pRule, "to.license") || has(pRule, "to.licenseNot")
    ) ||
    (pRuleSet?.allowed ?? []).some(
      (pRule) => has(pRule, "to.license") || has(pRule, "to.licenseNot")
    )
  );
}
/**
 *
 * @param {import('../../types/dependency-cruiser').IFlattenedRuleSet} pRuleSet
 * @return {boolean}
 */
export function ruleSetHasDeprecationRule(pRuleSet) {
  return (
    (pRuleSet?.forbidden ?? []).some((pRule) =>
      (pRule?.to?.dependencyTypes ?? []).includes("deprecated")
    ) ||
    (pRuleSet?.allowed ?? []).some((pRule) =>
      (pRule?.to?.dependencyTypes ?? []).includes("deprecated")
    )
  );
}
