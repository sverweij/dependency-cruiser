function pluckName({ name }) {
  return name;
}

// eslint-disable-next-line complexity
export default function isSameViolation(pLeftViolation, pRightViolation) {
  if (pLeftViolation.rule.name === pRightViolation.rule.name) {
    if (pRightViolation.cycle && pLeftViolation.cycle) {
      return (
        pLeftViolation.cycle.length === pRightViolation.cycle.length &&
        pLeftViolation.cycle
          .map(pluckName)
          .every((pModule) =>
            pRightViolation.cycle.map(pluckName).includes(pModule),
          )
      );
    }
    if (pRightViolation.via && pLeftViolation.via) {
      return (
        pLeftViolation.from === pRightViolation.from &&
        pLeftViolation.to === pRightViolation.to &&
        pLeftViolation.via.length === pRightViolation.via.length &&
        pLeftViolation.via
          .map(pluckName)
          .every((pModule) =>
            pRightViolation.via.map(pluckName).includes(pModule),
          )
      );
    }
    return (
      pLeftViolation.from === pRightViolation.from &&
      pLeftViolation.to === pRightViolation.to
    );
  }
  return false;
}
