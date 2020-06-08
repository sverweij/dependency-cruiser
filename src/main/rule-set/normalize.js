const VALID_SEVERITIES = /^(error|warn|info|ignore)$/;
const DEFAULT_SEVERITY = "warn";
const DEFAULT_RULE = "unnamed";

function normalizeSeverity(pSeverity) {
  const lSeverity = pSeverity ? pSeverity : DEFAULT_SEVERITY;

  return Boolean(lSeverity.match(VALID_SEVERITIES))
    ? lSeverity
    : DEFAULT_SEVERITY;
}

function normalizeName(pRule) {
  return pRule ? pRule : DEFAULT_RULE;
}

function normalizePaths(pDependencyEnd) {
  let lDependencyEnd = pDependencyEnd;

  if (Array.isArray(lDependencyEnd.path)) {
    lDependencyEnd.path = lDependencyEnd.path.join("|");
  }
  if (Array.isArray(lDependencyEnd.pathNot)) {
    lDependencyEnd.pathNot = lDependencyEnd.pathNot.join("|");
  }
  return lDependencyEnd;
}

function normalizeRule(pRule) {
  return {
    ...pRule,
    severity: normalizeSeverity(pRule.severity),
    name: normalizeName(pRule.name),
    from: normalizePaths(pRule.from),
    to: normalizePaths(pRule.to),
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
module.exports = (pRuleSet) => {
  if (Object.prototype.hasOwnProperty.call(pRuleSet, "allowed")) {
    pRuleSet.allowedSeverity = normalizeSeverity(pRuleSet.allowedSeverity);
    if (pRuleSet.allowedSeverity === "ignore") {
      Reflect.deleteProperty(pRuleSet, "allowed");
      Reflect.deleteProperty(pRuleSet, "allowedSeverity");
    } else {
      pRuleSet.allowed = pRuleSet.allowed.map((pRule) => ({
        ...pRule,
        name: "not-in-allowed",
        from: normalizePaths(pRule.from),
        to: normalizePaths(pRule.to),
      }));
    }
  }

  if (Object.prototype.hasOwnProperty.call(pRuleSet, "forbidden")) {
    pRuleSet.forbidden = pRuleSet.forbidden
      .map(normalizeRule)
      .filter((pRule) => pRule.severity !== "ignore");
  }

  return pRuleSet;
};
