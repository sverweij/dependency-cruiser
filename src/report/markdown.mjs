import {
  aggregateViolations,
  determineTo,
  determineFromExtras,
} from "./error-html/utl.mjs";
import meta from "#meta.cjs";
import { diffViolationArrays } from "#graph-utl/compare.mjs";

/**
 * @import { ICruiseResult, IViolation, ISummary } from "../../types/cruise-result.mjs"
 * @import { IMarkdownReporterOptions } from "../../types/reporter-options.mjs"
 * @import { IReporterOutput } from "../../types/dependency-cruiser.mjs"
 * @import { SeverityType } from "../../types/shared-types.mjs"
 */

/** @type {IMarkdownReporterOptions} */
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
  showExternalModulesUnresolved: false,
  showAliasedModulesUnresolved: false,
  noViolationsMessage:
    ":revolving_hearts: No violations found. Get gummy bears to celebrate.",

  showStaleBaselineDetails: true,

  showFooter: true,
  footer: `---\n[dependency-cruiser@${
    meta.version
  }](https://www.github.com/sverweij/dependency-cruiser) / ${new Date().toISOString()}`,
};

/**
 * @param {SeverityType} pSeverity
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
 * @param {ISummary} pSummary
 * @returns {string}
 */
function formatStatsSummary(pSummary) {
  const lSpacerLength = 4;
  const lSpacer = "&nbsp;".repeat(lSpacerLength);
  return `**${pSummary.totalCruised}** modules${lSpacer}`
    .concat(`**${pSummary.totalDependenciesCruised}** dependencies${lSpacer}`)
    .concat(`**${pSummary.error}** errors${lSpacer}`)
    .concat(`**${pSummary.warn}** warnings${lSpacer}`)
    .concat(`**${pSummary.info}** informational${lSpacer}`)
    .concat(`**${pSummary.ignore}** ignored`)
    .concat(
      (pSummary.baselineStale ?? 0) > 0
        ? `${lSpacer}**${pSummary.baselineStale}** stale entries in baseline`
        : "",
    )
    .concat("\n");
}

/**
 * @param {ICruiseResult} pCruiseResult
 * @param {Boolean} pIncludeIgnoredInSummary
 * @returns {string}
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
 * @param {IViolation[]} pViolations
 * @param {IMarkdownReporterOptions} pOptions
 * @returns {string}
 */
function formatViolations(pViolations, pOptions) {
  const lTableHead = "|violated rule|module|to|\n|:---|:---|:---|\n";

  return pViolations
    .filter(
      (pViolation) =>
        pViolation.rule.severity !== "ignore" ||
        pOptions.includeIgnoredInDetails,
    )
    .reduce((pAll, pViolation) => {
      const lFromExtras = determineFromExtras(pViolation);
      const lTo = determineTo(pViolation, pOptions);

      return `${pAll}|${severity2Icon(pViolation.rule.severity)}&nbsp;_${
        pViolation.rule.name
      }_|${pViolation.from}${lFromExtras}|${lTo}|\n`;
    }, lTableHead);
}

/**
 * @param {IViolation[]} pViolations
 * @param {IViolation[]} pKnownViolations
 * @param {IMarkdownReporterOptions} pOptions
 */
function staleBaselineDetails(pViolations, pKnownViolations, pOptions) {
  let lReturnValue = "";

  if (!pKnownViolations) {
    return lReturnValue;
  }

  const { old } = diffViolationArrays(pKnownViolations, pViolations);

  if (old.length > 0) {
    lReturnValue = "### :ghost: Stale entries in the baseline\n\n";
    lReturnValue +=
      "<details><summary>Stale violations in the baseline - click to expand</summary>\n\n";
    lReturnValue +=
      "These violations are in the baseline (typically `.dependency-cruiser-known-violations.json`) ";
    lReturnValue +=
      "but don't match any real violations anymore, e.g. because they were fixed in the meantime. You ";
    lReturnValue += "can remove them with dependency-cruiser's ";
    lReturnValue +=
      "[`--baseline --baseline-mode shrink-only`](https://github.com/sverweij/dependency-cruiser/blob/main/doc/cli.md#--baseline-create-or-update-a-known-violations-baseline) ";
    lReturnValue += "command line options.\n\n";
    lReturnValue += `${formatViolations(old, pOptions)}\n\n`;
    lReturnValue += `</details>\n\n`;
  }
  return lReturnValue;
}

/**
 * @param {IViolation[]} pViolations
 * @param {IMarkdownReporterOptions} pOptions
 * @returns {string}
 */
function details(pViolations, pOptions) {
  let lReturnValue = "";
  if (pViolations.length > 0) {
    if (pOptions.showDetailsHeader) {
      lReturnValue += `${pOptions.detailsHeader}\n\n`;
    }
    if (pOptions.collapseDetails) {
      lReturnValue += `<details><summary>${pOptions.collapsedMessage}</summary>\n\n`;
    }
    lReturnValue += `${formatViolations(pViolations, pOptions)}\n\n`;
    if (pOptions.collapseDetails) {
      lReturnValue += "</details>\n\n";
    }
  } else {
    lReturnValue += `${pOptions.noViolationsMessage}\n\n`;
  }
  return lReturnValue;
}

/**
 * @param {ICruiseResult} pResults
 * @param {IMarkdownReporterOptions} pOptions
 * @returns {string}
 */
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
 * @param {ICruiseResult} pResults
 * @param {IMarkdownReporterOptions} pOptions
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
    lReturnValue += details(pResults.summary.violations, lOptions);
  }

  if (lOptions.showStaleBaselineDetails) {
    lReturnValue += staleBaselineDetails(
      pResults.summary.violations,
      pResults.summary.optionsUsed?.knownViolations,
      lOptions,
    );
  }

  if (lOptions.showFooter) {
    lReturnValue += `${lOptions.footer}\n\n`;
  }

  return lReturnValue;
}

/**
 * Returns the violations from a cruise in markdown format
 *
 * @param {ICruiseResult} pResults
 * @param {IMarkdownReporterOptions} pOptions
 * @returns {IReporterOutput}
 */
export default function markdown(pResults, pOptions) {
  return {
    output: report(pResults, pOptions),
    exitCode: 0,
  };
}
