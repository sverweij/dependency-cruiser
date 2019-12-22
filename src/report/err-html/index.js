/* eslint-disable security/detect-object-injection */
const Handlebars = require("handlebars/runtime");
const _get = require("lodash/get");
const {
  getFormattedAllowedRule,
  mergeCountIntoRule,
  formatSummaryForReport
} = require("./utl");

// eslint-disable-next-line import/no-unassigned-import
require("./err-html.template");

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
    .concat(getFormattedAllowedRule(pRuleSetUsed))
    .map(pRule => mergeCountIntoRule(pRule, lViolationCounts))
    .sort(
      (pFirst, pSecond) =>
        Math.sign(pSecond.count - pFirst.count) ||
        pFirst.name.localeCompare(pSecond.name)
    );
}

function report(pResults) {
  return Handlebars.templates["err-html.template.hbs"]({
    summary: {
      ...formatSummaryForReport(pResults.summary),
      agggregateViolations: aggregateViolations(
        pResults.summary.violations,
        pResults.summary.ruleSetUsed
      )
    }
  });
}

/**
 * Returns the results of a cruise in an 'incidence matrix'
 *
 * @param {any} pResults - the output of a dependency-cruise adhering to ../../schema/cruise-result.schema.json
 * @returns {object} - output: an html program showing the summary & the violations (if any)
 *                     exitCode: 0
 */
module.exports = pResults => ({
  output: report(pResults),
  exitCode: 0
});
