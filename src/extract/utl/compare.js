function severity2number(pSeverity) {
  const SEVERITY2NUMBER = {
    error: 1,
    warn: 2,
    info: 3,
    ignore: 4,
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
  // As we're using this to compare (typescript) pre-compilation dependencies
  // with post-compilation dependencies we donot consider the moduleSystem.
  //
  // In typescript the module system will typically be es6. Compiled down to
  // javascript it can be es6, but also cjs (depends on the `module` setting
  // in your tsconfig). In the latter case, we're still looking at the same
  // dependency even though the module systems differ.
  return (pRightDependency) =>
    pLeftDependency.module === pRightDependency.module &&
    pLeftDependency.dynamic === pRightDependency.dynamic &&
    pLeftDependency.exoticRequire === pRightDependency.exoticRequire;
}

module.exports = {
  severities,
  violations,
  dependenciesEqual,
};
