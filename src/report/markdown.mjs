import {
  aggregateViolations,
  determineTo,
  determineFromExtras,
} from "./error-html/utl.mjs";
import meta from "#meta.cjs";

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
  footer: `---\n[dependency-cruiser@${
    meta.version
  }](https://www.github.com/sverweij/dependency-cruiser) / ${new Date().toISOString()}`,
};

/**
 * @param {import("../../types/shared-types.js").SeverityType} pSeverity
 * @returns {string}
 */
function severity2Icon(pSeverity) {
  const lSeverity2IconMap = new Map([
    ["error", ":exclamation:"],
    ["info", ":grey_exclamation:"],
    ["ignore", ":see_no_evil:"],
  ]);

  return lSeverity2IconMap.get(pSeverity) || ":warning:";
}

/**
 * @param {import("../../types/cruise-result.mjs").ISummary} pSummary
 * @return {string}
 */
function formatStatsSummary(pSummary) {
  const lSpacerLength = 4;
  const lSpacer = "&nbsp;".repeat(lSpacerLength);
  return `**${pSummary.totalCruised}** modules${lSpacer}**${pSummary.totalDependenciesCruised}** dependencies${lSpacer}**${pSummary.error}** errors${lSpacer}**${pSummary.warn}** warnings${lSpacer}**${pSummary.info}** informational${lSpacer}**${pSummary.ignore}** ignored\n`;
}

/**
 * @param {import("../../types/cruise-result.mjs").ICruiseResult} pCruiseResult
 * @param {Boolean} pIncludeIgnoredInSummary
 * @return {string}
 */
function formatRulesSummary(pCruiseResult, pIncludeIgnoredInSummary) {
  const lTableHead =
    "|rule|violations|ignored|explanation\n|:---|:---:|:---:|:---|\n";

  return aggregateViolations(
    pCruiseResult.summary.violations,
    pCruiseResult.summary.ruleSetUsed,
  )
    .filter(
      (pRule) =>
        pRule.count > 0 || (pIncludeIgnoredInSummary && pRule.ignoredCount > 0),
    )
    .reduce(
      (pAll, pRule) =>
        `${pAll}|${severity2Icon(pRule.severity)}&nbsp;_${pRule.name}_|**${
          pRule.count
        }**|**${pRule.ignoredCount}**|${pRule.comment}|\n`,
      lTableHead,
    );
}

/**
 *
 * @param {import("../../types/cruise-result.mjs").IViolation[]} pViolations
 * @param {boolean} pIncludeIgnoredInDetails
 * @return {string}
 */
function formatViolations(pViolations, pIncludeIgnoredInDetails) {
  const lTableHead = "|violated rule|module|to|\n|:---|:---|:---|\n";

  return pViolations
    .filter(
      (pViolation) =>
        pViolation.rule.severity !== "ignore" || pIncludeIgnoredInDetails,
    )
    .reduce((pAll, pViolation) => {
      const lFromExtras = determineFromExtras(pViolation);
      const lTo = determineTo(pViolation);

      return `${pAll}|${severity2Icon(pViolation.rule.severity)}&nbsp;_${
        pViolation.rule.name
      }_|${pViolation.from}${lFromExtras}|${lTo}|\n`;
    }, lTableHead);
}

function details(pResults, pOptions) {
  let lReturnValue = "";
  if (pResults.summary.violations.length > 0) {
    if (pOptions.showDetailsHeader) {
      lReturnValue += `${pOptions.detailsHeader}\n\n`;
    }
    if (pOptions.collapseDetails) {
      lReturnValue += `<details><summary>${pOptions.collapsedMessage}</summary>\n\n`;
    }
    lReturnValue += `${formatViolations(
      pResults.summary.violations,
      pOptions.includeIgnoredInDetails,
    )}\n\n`;
    if (pOptions.collapseDetails) {
      lReturnValue += "</details>\n\n";
    }
  } else {
    lReturnValue += `${pOptions.noViolationsMessage}\n\n`;
  }
  return lReturnValue;
}

function summary(pResults, pOptions) {
  let lReturnValue = "";

  if (pOptions.showSummaryHeader) {
    lReturnValue += `${pOptions.summaryHeader}\n\n`;
  }
  lReturnValue += `${formatStatsSummary(pResults.summary)}\n\n`;

  if (pResults.summary.violations.length > 0 && pOptions.showRulesSummary) {
    lReturnValue += `${formatRulesSummary(
      pResults,
      pOptions.includeIgnoredInSummary,
    )}\n\n`;
  }
  return lReturnValue;
}

/**
 * @param {import("../../types/cruise-result.mjs").ICruiseResult} pResults
 * @param {import("../../types/reporter-options.js").IMarkdownReporterOptions} pOptions
 * @returns {string}
 */
function report(pResults, pOptions) {
  const lOptions = { ...REPORT_DEFAULTS, ...(pOptions || {}) };
  let lReturnValue = "";

  if (lOptions.showTitle) {
    lReturnValue += `${lOptions.title}\n\n`;
  }

  if (lOptions.showSummary) {
    lReturnValue += summary(pResults, lOptions);
  }

  if (lOptions.showDetails) {
    lReturnValue += details(pResults, lOptions);
  }

  if (lOptions.showFooter) {
    lReturnValue += `${lOptions.footer}\n\n`;
  }

  return lReturnValue;
}

/**
 * Returns the violations from a cruise in markdown format
 *
 * @param {import("../../types/cruise-result.mjs").ICruiseResult} pResults
 * @param {import("../../types/reporter-options.js").IMarkdownReporterOptions} pOptions
 * @returns {import("../../types/dependency-cruiser.js").IReporterOutput}
 */
export default function markdown(pResults, pOptions) {
  return {
    output: report(pResults, pOptions),
    exitCode: 0,
  };
}
