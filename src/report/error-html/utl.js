const get = require("lodash/get");
const has = require("lodash/has");
const { version } = require("../../../src/meta.js");
const { formatViolation, formatInstability } = require("../utl/index.js");

function getFormattedAllowedRule(pRuleSetUsed) {
  const lAllowed = get(pRuleSetUsed, "allowed", []);
  const lCommentedRule = lAllowed.find((pRule) => has(pRule, "comment"));
  const lComment = lCommentedRule ? lCommentedRule.comment : "-";

  return lAllowed.length > 0
    ? {
        name: "not-in-allowed",
        comment: lComment,
        severity: get(pRuleSetUsed, "allowedSeverity", "warn"),
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

function aggregateCountsPerRule(pViolations) {
  return pViolations.reduce((pAll, pCurrentViolation) => {
    if (pAll[pCurrentViolation.rule.name]) {
      pAll[pCurrentViolation.rule.name] =
        pCurrentViolation.rule.severity === "ignore"
          ? {
              count: pAll[pCurrentViolation.rule.name].count,
              ignoredCount: pAll[pCurrentViolation.rule.name].ignoredCount + 1,
            }
          : {
              count: pAll[pCurrentViolation.rule.name].count + 1,
              ignoredCount: pAll[pCurrentViolation.rule.name].ignoredCount,
            };
    } else {
      pAll[pCurrentViolation.rule.name] =
        pCurrentViolation.rule.severity === "ignore"
          ? {
              count: 0,
              ignoredCount: 1,
            }
          : {
              count: 1,
              ignoredCount: 0,
            };
    }
    return pAll;
  }, {});
}

function aggregateViolations(pViolations, pRuleSetUsed) {
  const lViolationCounts = aggregateCountsPerRule(pViolations);

  return get(pRuleSetUsed, "forbidden", [])
    .concat(get(pRuleSetUsed, "required", []))
    .concat(getFormattedAllowedRule(pRuleSetUsed))
    .map((pRule) => mergeCountsIntoRule(pRule, lViolationCounts))
    .sort(
      (pFirst, pSecond) =>
        Math.sign(pSecond.count - pFirst.count) ||
        Math.sign(pSecond.ignoredCount - pFirst.ignoredCount) ||
        pFirst.name.localeCompare(pSecond.name)
    );
}

module.exports = {
  aggregateViolations,
  getFormattedAllowedRule,
  mergeCountsIntoRule,
  formatSummaryForReport,
  determineFromExtras,
  determineTo,
};
