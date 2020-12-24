const _has = require("lodash/has");
const normalizeREProperties = require("../utl/normalize-re-properties");

const VALID_SEVERITIES = /^(error|warn|info|ignore)$/;
const DEFAULT_SEVERITY = "warn";
const DEFAULT_RULE = "unnamed";

function normalizeSeverity(pSeverity) {
  const lSeverity = pSeverity ? pSeverity : DEFAULT_SEVERITY;

  return Boolean(lSeverity.match(VALID_SEVERITIES))
    ? lSeverity
    : DEFAULT_SEVERITY;
}

function normalizeName(pRuleName) {
  return pRuleName ? pRuleName : DEFAULT_RULE;
}

function normalizeRule(pRule) {
  return {
    ...pRule,
    severity: normalizeSeverity(pRule.severity),
    name: normalizeName(pRule.name),
    from: normalizeREProperties(pRule.from),
    to: normalizeREProperties(pRule.to),
    ...(pRule.module ? { module: normalizeREProperties(pRule.module) } : {}),
  };
}

/**
 * 'Normalizes' the given rule set pRuleSet by adding default values for
 * attributes that are optional and not present in the rule set; in casu:
 * - rule name (default 'unnamed')
 * - severity (default 'warn')
 *
 * @param  {object} pRuleSet [description]
 * @return {object}          [description]
 */
module.exports = function normalizeRuleSet(pRuleSet) {
  if (_has(pRuleSet, "allowed")) {
    pRuleSet.allowedSeverity = normalizeSeverity(pRuleSet.allowedSeverity);
    if (pRuleSet.allowedSeverity === "ignore") {
      Reflect.deleteProperty(pRuleSet, "allowed");
      Reflect.deleteProperty(pRuleSet, "allowedSeverity");
    } else {
      pRuleSet.allowed = pRuleSet.allowed.map((pRule) => ({
        ...pRule,
        name: "not-in-allowed",
        from: normalizeREProperties(pRule.from),
        to: normalizeREProperties(pRule.to),
      }));
    }
  }

  if (_has(pRuleSet, "forbidden")) {
    pRuleSet.forbidden = pRuleSet.forbidden
      .map(normalizeRule)
      .filter((pRule) => pRule.severity !== "ignore");
  }

  if (_has(pRuleSet, "required")) {
    pRuleSet.required = pRuleSet.required
      .map(normalizeRule)
      .filter((pRule) => pRule.severity !== "ignore");
  }

  return pRuleSet;
};
