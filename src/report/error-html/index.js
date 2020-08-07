/* eslint-disable security/detect-object-injection */
const Handlebars = require("handlebars/runtime");
const _get = require("lodash/get");
const {
  getFormattedAllowedRule,
  mergeCountIntoRule,
  formatSummaryForReport,
} = require("./utl");

// eslint-disable-next-line import/no-unassigned-import
require("./error-html.template");

function aggregateViolations(pViolations, pRuleSetUsed) {
  const lViolationCounts = pViolations.reduce((pAll, pCurrentViolation) => {
    if (pAll[pCurrentViolation.rule.name]) {
      pAll[pCurrentViolation.rule.name] += 1;
    } else {
      pAll[pCurrentViolation.rule.name] = 1;
    }
    return pAll;
  }, {});

  return _get(pRuleSetUsed, "forbidden", [])
    .concat(_get(pRuleSetUsed, "required", []))
    .concat(getFormattedAllowedRule(pRuleSetUsed))
    .map((pRule) => mergeCountIntoRule(pRule, lViolationCounts))
    .sort(
      (pFirst, pSecond) =>
        Math.sign(pSecond.count - pFirst.count) ||
        pFirst.name.localeCompare(pSecond.name)
    );
}

function massageSummaryIntoSomethingUsable(pResults) {
  const lSummary = formatSummaryForReport(pResults.summary);
  return {
    summary: {
      ...lSummary,
      agggregateViolations: aggregateViolations(
        lSummary.violations,
        lSummary.ruleSetUsed
      ),
    },
  };
}

function report(pResults) {
  return Handlebars.templates["error-html.template.hbs"](
    massageSummaryIntoSomethingUsable(pResults)
  );
}

/**
 * Returns the results of a cruise in an 'incidence matrix'
 *
 * @param {ICruiseResult} pResults - the output of a dependency-cruise adhering to ../../schema/cruise-result.schema.json
 * @returns {IReporterOutput} - output: an html program showing the summary & the violations (if any)
 *                              exitCode: 0
 */
module.exports = (pResults) => ({
  output: report(pResults),
  exitCode: 0,
});
