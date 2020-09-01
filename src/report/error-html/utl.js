const _get = require("lodash/get");
const _has = require("lodash/has");
const { version } = require("../../../package.json");

function getFormattedAllowedRule(pRuleSetUsed) {
  const lAllowed = _get(pRuleSetUsed, "allowed", []);
  const lCommentedRule = lAllowed.find((pRule) => _has(pRule, "comment"));
  const lComment = lCommentedRule ? lCommentedRule.comment : "-";

  return lAllowed.length > 0
    ? {
        name: "not-in-allowed",
        comment: lComment,
        severity: _get(pRuleSetUsed, "allowedSeverity", "warn"),
      }
    : [];
}

function mergeCountIntoRule(pRule, pViolationCounts) {
  const lCount = pViolationCounts[pRule.name]
    ? pViolationCounts[pRule.name]
    : 0;

  return {
    ...pRule,
    count: lCount,
    unviolated: lCount <= 0,
  };
}

function determineTo(pViolation) {
  if (pViolation.cycle) {
    return pViolation.cycle.join(" &rightarrow;<br/>");
  }
  if (pViolation.via) {
    return `${pViolation.to}<br/>${pViolation.via.join(" &rightarrow;<br/>")}`;
  }
  return pViolation.from === pViolation.to ? "" : pViolation.to;
}

function formatSummaryForReport(pSummary) {
  return {
    ...pSummary,
    depcruiseVersion: `dependency-cruiser@${version}`,
    runDate: new Date().toISOString(),
    violations: (pSummary.violations || []).map((pViolation) => ({
      ...pViolation,
      to: determineTo(pViolation),
    })),
  };
}

module.exports = {
  getFormattedAllowedRule,
  mergeCountIntoRule,
  formatSummaryForReport,
  determineTo,
};
