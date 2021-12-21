const _get = require("lodash/get");
const _has = require("lodash/has");
const { version } = require("../../../src/meta.js");
const { formatViolation, formatInstability } = require("../utl/index.js");

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

function formatCycleTo(pViolation) {
  return pViolation.cycle.join(" &rightarrow;<br/>");
}

function formatReachabilityTo(pViolation) {
  return `${pViolation.to}<br/>${pViolation.via.join(" &rightarrow;<br/>")}`;
}

function formatDependencyTo(pViolation) {
  return pViolation.to;
}

function formatModuleTo() {
  return "";
}

function formatInstabilityTo(pViolation) {
  return `${pViolation.to}&nbsp;<span class="extra">(I: ${formatInstability(
    pViolation.metrics.to.instability
  )})</span>`;
}

function determineTo(pViolation) {
  const lViolationType2Formatter = {
    dependency: formatDependencyTo,
    module: formatModuleTo,
    cycle: formatCycleTo,
    reachability: formatReachabilityTo,
    instability: formatInstabilityTo,
  };
  return formatViolation(
    pViolation,
    lViolationType2Formatter,
    formatDependencyTo
  );
}

function formatInstabilityFromExtras(pViolation) {
  return `&nbsp;<span class="extra">(I: ${formatInstability(
    pViolation.metrics.from.instability
  )})</span>`;
}

function determineFromExtras(pViolation) {
  const lViolationType2Formatter = {
    instability: formatInstabilityFromExtras,
  };
  return formatViolation(pViolation, lViolationType2Formatter, () => "");
}

function formatSummaryForReport(pSummary) {
  return {
    ...pSummary,
    depcruiseVersion: `dependency-cruiser@${version}`,
    runDate: new Date().toISOString(),
    violations: (pSummary.violations || []).map((pViolation) => ({
      ...pViolation,
      fromExtras: determineFromExtras(pViolation),
      to: determineTo(pViolation),
    })),
  };
}

module.exports = {
  getFormattedAllowedRule,
  mergeCountsIntoRule,
  formatSummaryForReport,
  determineFromExtras,
  determineTo,
};
