const Handlebars = require("handlebars/runtime");
const { formatSummaryForReport, aggregateViolations } = require("./utl");

// eslint-disable-next-line import/no-unassigned-import
require("./error-html.template");

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
 * @param {import("../../../types/cruise-result").ICruiseResult} pResults - the output of a dependency-cruise adhering to ../../schema/cruise-result.schema.json
 * @returns {import("../../../types/dependency-cruiser").IReporterOutput} - output: an html program showing the summary & the violations (if any)
 *                              exitCode: 0
 */
module.exports = (pResults) => ({
  output: report(pResults),
  exitCode: 0,
});
