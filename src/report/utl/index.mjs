// eslint-disable-next-line no-undefined
export const formatPercentage = new Intl.NumberFormat(undefined, {
  style: "percent",
}).format;

export function formatViolation(
  pViolation,
  pViolationType2Formatter,
  pDefaultFormatter
) {
  return (pViolationType2Formatter[pViolation.type] || pDefaultFormatter)(
    pViolation
  );
}
