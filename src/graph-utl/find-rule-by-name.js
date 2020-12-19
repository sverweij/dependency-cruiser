const _get = require("lodash/get");

/**
 * Finds the first rule in the rule set that has name pName,
 * and undefined if no such rule exists/ the rule is an 'allowed'
 * rule.
 *
 * (this thing probably belongs in a model-like folder and not in utl)
 * @param {import("../../types/configuration").IConfiguration} pRuleSet - The rule set to search in
 * @param {string} pName - The rule name to look for
 * @return {import("../../types/rule-set").IForbiddenRuleType|import("../../types/rule-set").IAllowedRuleType} - a rule (or 'undefined' if nothing found)
 */
module.exports = function findRuleByName(pRuleSet, pName) {
  return _get(pRuleSet, "forbidden", []).find(
    (pForbiddenRule) => pForbiddenRule.name === pName
  );
};
