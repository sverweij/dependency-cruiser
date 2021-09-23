const _uniqWith = require("lodash/uniqWith");

function violationIsEqual(pLeftViolation, pRightViolation) {
  let lReturnValue = false;
  if (
    pLeftViolation.rule.name === pRightViolation.rule.name &&
    pLeftViolation.cycle
  ) {
    lReturnValue =
      pLeftViolation.cycle.length === pRightViolation.cycle.length &&
      pLeftViolation.cycle.every((pModuleName) =>
        pRightViolation.cycle.includes(pModuleName)
      );
  }
  return lReturnValue;
}

module.exports = function deDuplicateViolations(pViolations) {
  return _uniqWith(pViolations, violationIsEqual);
};
