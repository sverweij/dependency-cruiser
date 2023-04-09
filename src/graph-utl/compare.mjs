function severity2number(pSeverity) {
  const lSeverity2Number = {
    error: 1,
    warn: 2,
    info: 3,
    ignore: 4,
  };

  // eslint-disable-next-line security/detect-object-injection
  return lSeverity2Number[pSeverity] || -1;
}

export function severities(pFirstSeverity, pSecondSeverity) {
  return Math.sign(
    severity2number(pFirstSeverity) - severity2number(pSecondSeverity)
  );
}

export function violations(pFirstViolation, pSecondViolation) {
  return (
    severities(pFirstViolation.rule.severity, pSecondViolation.rule.severity) ||
    pFirstViolation.rule.name.localeCompare(pSecondViolation.rule.name) ||
    pFirstViolation.from.localeCompare(pSecondViolation.from) ||
    pFirstViolation.to.localeCompare(pSecondViolation.to)
  );
}

export function rules(pLeftRule, pRightRule) {
  return (
    severities(pLeftRule.severity, pRightRule.severity) ||
    pLeftRule.name.localeCompare(pRightRule.name)
  );
}

export function modules(pLeftModule, pRightModule) {
  return pLeftModule.source > pRightModule.source ? 1 : -1;
}

export default {
  modules,
  rules,
  severities,
  violations,
};
