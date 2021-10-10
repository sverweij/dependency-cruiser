const _get = require("lodash/get");
const _has = require("lodash/has");
const { version } = require("../../../src/meta.js");

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

function mergeCountsIntoRule(pRule, pViolationCounts) {
  const lCounts = pViolationCounts[pRule.name]
    ? pViolationCounts[pRule.name]
    : { count: 0, ignoredCount: 0 };

  return {
    ...pRule,
    count: lCounts.count,
    ignoredCount: lCounts.ignoredCount,
    unviolated: lCounts.count <= 0,
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
  mergeCountsIntoRule,
  formatSummaryForReport,
  determineTo,
};
