const _get = require("lodash/get");
const _has = require("lodash/has");

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
function findRuleByName(pRuleSet, pName) {
  return _get(pRuleSet, "forbidden", []).find(
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
function ruleSetHasLicenseRule(pRuleSet) {
  return (
    _get(pRuleSet, "forbidden", []).some(
      (pRule) => _has(pRule, "to.license") || _has(pRule, "to.licenseNot")
    ) ||
    _get(pRuleSet, "allowed", []).some(
      (pRule) => _has(pRule, "to.license") || _has(pRule, "to.licenseNot")
    )
  );
}
/**
 *
 * @param {import('../../types/dependency-cruiser').IFlattenedRuleSet} pRuleSet
 * @return {boolean}
 */
function ruleSetHasDeprecationRule(pRuleSet) {
  return (
    _get(pRuleSet, "forbidden", []).some((pRule) =>
      _get(pRule, "to.dependencyTypes", []).includes("deprecated")
    ) ||
    _get(pRuleSet, "allowed", []).some((pRule) =>
      _get(pRule, "to.dependencyTypes", []).includes("deprecated")
    )
  );
}

module.exports = {
  findRuleByName,
  ruleSetHasLicenseRule,
  ruleSetHasDeprecationRule,
};
