function severity2number(pSeverity) {
  const SEVERITY2NUMBER = {
    error: 1,
    warn: 2,
    info: 3,
    ignore: 4
  };

  // eslint-disable-next-line security/detect-object-injection
  return SEVERITY2NUMBER[pSeverity] || -1;
}

function severities(pFirstSeverity, pSecondSeverity) {
  return Math.sign(
    severity2number(pFirstSeverity) - severity2number(pSecondSeverity)
  );
}

function violations(pFirstViolation, pSecondViolation) {
  return (
    severities(pFirstViolation.rule.severity, pSecondViolation.rule.severity) ||
    pFirstViolation.rule.name.localeCompare(pSecondViolation.rule.name) ||
    pFirstViolation.from.localeCompare(pSecondViolation.from) ||
    pFirstViolation.to.localeCompare(pSecondViolation.to)
  );
}

function dependenciesEqual(pLeftDependency) {
  return pRightDependency =>
    pLeftDependency.module === pRightDependency.module &&
    pLeftDependency.moduleSystem === pRightDependency.moduleSystem &&
    pLeftDependency.dynamic === pRightDependency.dynamic &&
    pLeftDependency.exoticRequire === pRightDependency.exoticRequire;
}

module.exports = {
  severities,
  violations,
  dependenciesEqual
};
