import Handlebars from "handlebars/runtime.js";
import { formatSummaryForReport, aggregateViolations } from "./utl.mjs";

await import("./error-html.template.js");

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
 * @param {import("../../../types/cruise-result.js").ICruiseResult} pResults - the output of a dependency-cruise adhering to ../../schema/cruise-result.schema.json
 * @returns {import("../../../types/dependency-cruiser.js").IReporterOutput} - output: an html program showing the summary & the violations (if any)
 *                              exitCode: 0
 */
export default function errorHtml(pResults) {
  return {
    output: report(pResults),
    exitCode: 0,
  };
}
