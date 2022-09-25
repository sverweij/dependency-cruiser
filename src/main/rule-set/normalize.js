const cloneDeep = require("lodash/cloneDeep");
const has = require("lodash/has");
const { normalizeREProperties } = require("../utl/normalize-re-properties");

const VALID_SEVERITIES = /^(error|warn|info|ignore)$/;
const DEFAULT_SEVERITY = "warn";
const DEFAULT_RULE = "unnamed";
const DEFAULT_SCOPE = "module";

function normalizeSeverity(pSeverity) {
  const lSeverity = pSeverity ? pSeverity : DEFAULT_SEVERITY;

  return Boolean(lSeverity.match(VALID_SEVERITIES))
    ? lSeverity
    : DEFAULT_SEVERITY;
}
/**
 *
 * @param {string} pRuleName
 * @returns {string}
 */
function normalizeName(pRuleName) {
  return pRuleName ? pRuleName : DEFAULT_RULE;
}

/**
 *
 * @param {import("../../../types/shared-types").RuleScopeType} pScope?
 * @returns {import("../../../types/shared-types").RuleScopeType}
 */
function normalizeScope(pScope) {
  return pScope ? pScope : DEFAULT_SCOPE;
}

/**
 *
 * @param {import("../../../types/rule-set").IAnyRuleType} pRule
 * @returns {import("../../../types/strict-rule-set").IStrictAnyRuleType}
 */
function normalizeRule(pRule) {
  return {
    ...pRule,
    severity: normalizeSeverity(pRule.severity),
    name: normalizeName(pRule.name),
    from: normalizeREProperties(pRule.from),
    to: normalizeREProperties(pRule.to),
    scope: normalizeScope(pRule.scope),
    ...(pRule.module ? { module: normalizeREProperties(pRule.module) } : {}),
  };
}

/**
 * 'Normalizes' the given rule set pRuleSet by adding default values for
 * attributes that are optional and not present in the rule set; in casu:
 * - rule name (default 'unnamed')
 * - severity (default 'warn')
 *
 * @param  {import("../../../types/dependency-cruiser").IFlattenedRuleSet} pRuleSet
 * @return {import("../../../types/strict-rule-set").IStrictRuleSet}
 */
module.exports = function normalizeRuleSet(pRuleSet) {
  const lRuleSet = cloneDeep(pRuleSet);

  if (has(lRuleSet, "allowed")) {
    lRuleSet.allowedSeverity = normalizeSeverity(lRuleSet.allowedSeverity);
    if (lRuleSet.allowedSeverity === "ignore") {
      Reflect.deleteProperty(lRuleSet, "allowed");
      Reflect.deleteProperty(lRuleSet, "allowedSeverity");
    } else {
      lRuleSet.allowed = lRuleSet.allowed.map((pRule) => ({
        ...pRule,
        name: "not-in-allowed",
        from: normalizeREProperties(pRule.from),
        to: normalizeREProperties(pRule.to),
      }));
    }
  }

  if (has(lRuleSet, "forbidden")) {
    lRuleSet.forbidden = lRuleSet.forbidden
      .map(normalizeRule)
      .filter((pRule) => pRule.severity !== "ignore");
  }

  if (has(lRuleSet, "required")) {
    lRuleSet.required = lRuleSet.required
      .map(normalizeRule)
      .filter((pRule) => pRule.severity !== "ignore");
  }

  return lRuleSet;
};
