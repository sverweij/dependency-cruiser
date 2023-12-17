function pluckName({ name }) {
  return name;
}

export default function isSameViolation(pLeftViolation, pRightViolation) {
  let lReturnValue = false;

  if (pLeftViolation.rule.name === pRightViolation.rule.name) {
    if (pRightViolation.cycle && pLeftViolation.cycle) {
      lReturnValue =
        pLeftViolation.cycle.length === pRightViolation.cycle.length &&
        pLeftViolation.cycle
          .map(pluckName)
          .every((pModule) =>
            pRightViolation.cycle.map(pluckName).includes(pModule),
          );
    } else {
      lReturnValue =
        pLeftViolation.from === pRightViolation.from &&
        pLeftViolation.to === pRightViolation.to;
    }
  }
  return lReturnValue;
}
