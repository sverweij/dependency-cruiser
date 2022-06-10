const { version } = require("../meta.js");
const {
  aggregateViolations,
  determineTo,
  determineFromExtras,
} = require("./error-html/utl");

const REPORT_DEFAULTS = {
  showTitle: true,
  title: "## Forbidden dependency check - results",

  showSummary: true,
  showSummaryHeader: true,
  summaryHeader: "### :chart_with_upwards_trend: Summary",
  showStatsSummary: true,
  showRulesSummary: true,
  includeIgnoredInSummary: true,

  showDetails: true,
  includeIgnoredInDetails: true,
  showDetailsHeader: true,
  detailsHeader: "### :fire: All violations",
  collapseDetails: true,
  collapsedMessage: "Violations found - click to expand",
  noViolationsMessage:
    ":revolving_hearts: No violations found. Get gummy bears to celebrate.",

  showFooter: true,
  footer: `---\n[dependency-cruiser@${version}](https://www.github.com/sverweij/dependency-cruiser) / ${new Date().toISOString()}`,
};

/**
 *
 * @param {import("../../types/shared-types").SeverityType} pSeverity
 */
function severity2Icon(pSeverity) {
  const lSeverity2IconMap = {
    error: ":exclamation:",
    info: ":grey_exclamation:",
    ignore: ":see_no_evil:",
  };
  // eslint-disable-next-line security/detect-object-injection
  return lSeverity2IconMap[pSeverity] || ":warning:";
}

/**
 *
 * @param {import("../../types/cruise-result").ISummary} pSummary
 */
function formatStatsSummary(pSummary) {
  const lSpacerLength = 4;
  const lSpacer = "&nbsp;".repeat(lSpacerLength);
  return `**${pSummary.totalCruised}** modules${lSpacer}**${pSummary.totalDependenciesCruised}** dependencies${lSpacer}**${pSummary.error}** errors${lSpacer}**${pSummary.warn}** warnings${lSpacer}**${pSummary.info}** informational${lSpacer}**${pSummary.ignore}** ignored\n`;
}

/**
 *
 * @param {import("../../types/cruise-result").ICruiseResult} pCruiseResult
 * @param {Boolean} pIncludeIgnoredInSummary
 * @return {string}
 */
function formatRulesSummary(pCruiseResult, pIncludeIgnoredInSummary) {
  const lTableHead =
    "|rule|violations|ignored|explanation\n|:---|:---:|:---:|:---|\n";

  return aggregateViolations(
    pCruiseResult.summary.violations,
    pCruiseResult.summary.ruleSetUsed
  )
    .filter(
      (pRule) =>
        pRule.count > 0 || (pIncludeIgnoredInSummary && pRule.ignoredCount > 0)
    )
    .reduce(
      (pAll, pRule) =>
        (pAll += `|${severity2Icon(pRule.severity)}&nbsp;_${pRule.name}_|**${
          pRule.count
        }**|**${pRule.ignoredCount}**|${pRule.comment}|\n`),
      lTableHead
    );
}

/**
 *
 * @param {import("../../types/cruise-result").IViolation[]} pViolations
 * @param {boolean} pIncludeIgnoredInDetails
 * @return {string}
 */
function formatViolations(pViolations, pIncludeIgnoredInDetails) {
  const lTableHead = "|violated rule|module|to|\n|:---|:---|:---|\n";

  return pViolations
    .filter(
      (pViolation) =>
        pViolation.rule.severity !== "ignore" || pIncludeIgnoredInDetails
    )
    .reduce((pAll, pViolation) => {
      const lFromExtras = determineFromExtras(pViolation);
      const lTo = determineTo(pViolation);

      return `${pAll}|${severity2Icon(pViolation.rule.severity)}&nbsp;_${
        pViolation.rule.name
      }_|${pViolation.from}${lFromExtras}|${lTo}|\n`;
    }, lTableHead);
}

/**
 *
 * @param {import("../../types/cruise-result").ICruiseResult} pResults
 * @param {import("../../types/reporter-options").IMarkdownReporterOptions} pOptions
 */
// eslint-disable-next-line complexity, max-statements
function report(pResults, pOptions) {
  const lOptions = { ...REPORT_DEFAULTS, ...(pOptions || {}) };
  let lReturnValue = "";

  if (lOptions.showTitle) {
    lReturnValue += `${lOptions.title}\n\n`;
  }

  if (lOptions.showSummary) {
    if (lOptions.showSummaryHeader) {
      lReturnValue += `${lOptions.summaryHeader}\n\n`;
    }
    lReturnValue += `${formatStatsSummary(pResults.summary)}\n\n`;

    if (pResults.summary.violations.length > 0 && lOptions.showRulesSummary) {
      lReturnValue += `${formatRulesSummary(
        pResults,
        lOptions.includeIgnoredInSummary
      )}\n\n`;
    }
  }

  if (lOptions.showDetails) {
    if (pResults.summary.violations.length > 0) {
      if (lOptions.showDetailsHeader) {
        lReturnValue += `${lOptions.detailsHeader}\n\n`;
      }
      if (lOptions.collapseDetails) {
        lReturnValue += `<details><summary>${lOptions.collapsedMessage}</summary>\n\n`;
      }
      lReturnValue += `${formatViolations(
        pResults.summary.violations,
        lOptions.includeIgnoredInDetails
      )}\n\n`;
      if (lOptions.collapseDetails) {
        lReturnValue += "</details>\n\n";
      }
    } else {
      lReturnValue += `${lOptions.noViolationsMessage}\n\n`;
    }
  }

  if (lOptions.showFooter) {
    lReturnValue += `${lOptions.footer}\n\n`;
  }

  return lReturnValue;
}

/**
 * Returns the violations from a cruise in markdown format
 *
 * @param {import("../../types/cruise-result").ICruiseResult} pResults
 * @param {import("../../types/reporter-options").IMarkdownReporterOptions} pOptions
 * @returns {import("../../types/dependency-cruiser").IReporterOutput}
 */
module.exports = (pResults, pOptions) => ({
  output: report(pResults, pOptions),
  exitCode: 0,
});
