function formatInstability(pNumber) {
  // eslint-disable-next-line no-magic-numbers
  return Math.round(100 * pNumber);
}

function formatViolation(
  pViolation,
  pViolationType2Formatter,
  pDefaultFormatter
) {
  return (pViolationType2Formatter[pViolation.type] || pDefaultFormatter)(
    pViolation
  );
}

module.exports = { formatViolation, formatInstability };
