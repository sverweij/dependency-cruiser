const _difference = require("lodash/difference");
const _uniqWith = require("lodash/uniqWith");

function violationIsEqual(pLeftViolation, pRightViolation) {
  if (
    pLeftViolation.rule.name === pRightViolation.rule.name &&
    pLeftViolation.cycle
  ) {
    return (
      _difference(pLeftViolation.cycle, pRightViolation.cycle).length === 0
    );
  }
  return false;
}

module.exports = function deDuplicateViolations(pViolations) {
  return _uniqWith(pViolations, violationIsEqual);
};
