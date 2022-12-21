// eslint-disable-next-line no-undefined
const formatPercentage = new Intl.NumberFormat(undefined, { style: "percent" })
  .format;

function formatViolation(
  pViolation,
  pViolationType2Formatter,
  pDefaultFormatter
) {
  return (pViolationType2Formatter[pViolation.type] || pDefaultFormatter)(
    pViolation
  );
}

module.exports = { formatViolation, formatPercentage };
