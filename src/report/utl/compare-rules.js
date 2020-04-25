// this is (very close to a) duplicate of a quite similar sorting
// module in extract/utl/compare.js
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

function compareSeverities(pRightSeverity, pLeftSeverity) {
  return Math.sign(
    severity2number(pRightSeverity) - severity2number(pLeftSeverity)
  );
}

module.exports = (pLeftRule, pRightRule) =>
  compareSeverities(pLeftRule.severity, pRightRule.severity) ||
  pLeftRule.name.localeCompare(pRightRule.name);
