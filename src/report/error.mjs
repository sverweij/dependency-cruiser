import { EOL } from "node:os";
import { styleText } from "node:util";
import {
  formatPercentage,
  formatViolation as _formatViolation,
  formatDependencyTo,
} from "./utl/index.mjs";
import { findRuleByName } from "#graph-utl/rule-set.mjs";
import wrapAndIndent from "#utl/wrap-and-indent.mjs";

/**
 * @import { ICruiseResult, IEnvironmentIssue } from "../../types/cruise-result.mjs"
 * @import { IErrorReporterOptions } from "../../types/reporter-options.mjs"
 * @import { IReporterOutput } from "../../types/dependency-cruiser.js"
 * @import { SeverityType } from "../../types/shared-types.mjs"
 */

const SEVERITY2COLOR = new Map([
  ["error", "red"],
  ["warn", "yellow"],
  ["info", "cyan"],
  ["ignore", "gray"],
]);

const SEVERITY2ICON = new Map([
  ["error", "x"],
  ["warn", "‼"],
  ["info", "i"],
  ["ignore", "-"],
]);

const EXTRA_PATH_INFORMATION_INDENT = 6;

function formatMiniDependency(pMiniDependency) {
  return EOL.concat(
    wrapAndIndent(
      pMiniDependency.map(({ name }) => name).join(` → ${EOL}`),
      EXTRA_PATH_INFORMATION_INDENT,
    ),
  );
}

function formatModuleViolation(pViolation) {
  return styleText("bold", pViolation.from);
}

function formatDependencyViolation(pViolation, pOptions) {
  return `${styleText("bold", pViolation.from)} → ${styleText("bold", formatDependencyTo(pViolation, pOptions))}`;
}

function formatCycleViolation(pViolation) {
  return `${styleText("bold", pViolation.from)} → ${formatMiniDependency(pViolation.cycle)}`;
}

function formatReachabilityViolation(pViolation) {
  return `${styleText("bold", pViolation.from)} → ${styleText("bold", pViolation.to)}${formatMiniDependency(pViolation.via)}`;
}

function formatInstabilityViolation(pViolation, pOptions) {
  return `${formatDependencyViolation(pViolation, pOptions)}${EOL}${styleText(
    "dim",
    wrapAndIndent(
      `instability: ${formatPercentage(pViolation.metrics.from.instability)} → ${formatPercentage(pViolation.metrics.to.instability)}`,
      EXTRA_PATH_INFORMATION_INDENT,
    ),
  )}`;
}

function formatViolation(pViolation, pOptions) {
  const lViolationType2Formatter = {
    module: formatModuleViolation,
    dependency: formatDependencyViolation,
    cycle: formatCycleViolation,
    reachability: formatReachabilityViolation,
    instability: formatInstabilityViolation,
  };
  const lFormattedViolators = _formatViolation(
    pViolation,
    lViolationType2Formatter,
    formatDependencyViolation,
    pOptions,
  );

  return (
    `${styleText(
      SEVERITY2COLOR.get(pViolation.rule.severity),
      pViolation.rule.severity,
    )} ${pViolation.rule.name}: ${lFormattedViolators}` +
    `${
      pViolation.comment
        ? `${EOL}${styleText("dim", wrapAndIndent(pViolation.comment))}${EOL}`
        : ""
    }`
  );
}

function formatMeta(pMeta) {
  return `${pMeta.error} errors, ${pMeta.warn} warnings`;
}

function sumMeta(pMeta) {
  return pMeta.error + pMeta.warn + pMeta.info;
}

function formatSummary(pSummary) {
  const lMessage = `${EOL}x ${sumMeta(
    pSummary,
  )} dependency violations (${formatMeta(pSummary)}). ${
    pSummary.totalCruised
  } modules, ${pSummary.totalDependenciesCruised} dependencies cruised.${EOL}`;

  return pSummary.error > 0 ? styleText("red", lMessage) : lMessage;
}

function addExplanation(pRuleSet, pLong) {
  return pLong
    ? (pViolation) => ({
        ...pViolation,
        comment: findRuleByName(pRuleSet, pViolation.rule.name)?.comment ?? "-",
      })
    : (pViolation) => pViolation;
}

/**
 * @param {number} pNumberOfIgnoredViolations
 * @returns {string}
 */
function formatIgnoreWarning(pNumberOfIgnoredViolations) {
  if (pNumberOfIgnoredViolations > 0) {
    return styleText(
      "yellow",
      `‼ ${pNumberOfIgnoredViolations} known violations ignored. Run with --no-ignore-known to see them.${EOL}`,
    );
  }
  return "";
}

/**
 * @param {IEnvironmentIssue} pEnvironmentIssue
 * @returns {string}
 */
function formatEnvironmentIssue(pEnvironmentIssue) {
  return styleText(
    SEVERITY2COLOR.get(pEnvironmentIssue.severity),
    `${SEVERITY2ICON.get(pEnvironmentIssue.severity)} ${styleText("bold", pEnvironmentIssue.name)}: ${pEnvironmentIssue.description}`,
  );
}

/**
 * @param {IEnvironmentIssue[]} pEnvironmentIssues
 * @returns {string}
 */
function formatEnvironmentIssues(pEnvironmentIssues) {
  const lEnvironmentIssues = pEnvironmentIssues ?? [];

  return (
    (lEnvironmentIssues.length > 0 ? EOL : "") +
    lEnvironmentIssues.map(formatEnvironmentIssue).join(EOL)
  );
}

/**
 * @param {number} pBaselineStaleCount
 * @param {SeverityType} pStaleEntriesSeverity
 * @returns {string}
 */
function formatStaleBaselineMessage(
  pBaselineStaleCount,
  pStaleEntriesSeverity,
) {
  if ((pBaselineStaleCount ?? 0) > 0) {
    const lStaleEntriesSeverity = pStaleEntriesSeverity ?? "warn";
    return styleText(
      SEVERITY2COLOR.get(lStaleEntriesSeverity),
      `${SEVERITY2ICON.get(lStaleEntriesSeverity)} ${pBaselineStaleCount} stale known violations in the baseline. Run with '--baseline --baseline-mode shrink-only' to remove them.${EOL}`,
    );
  }
  return "";
}

/**
 * @param {ICruiseResult} pResults
 * @param {IErrorReporterOptions} pOptions
 * @returns {string}
 */
function report(pResults, pOptions) {
  const lOptions = {
    long: false,
    showExternalModulesUnresolved: false,
    showAliasedModulesUnresolved: false,
    ...pOptions,
  };
  const lNonIgnorableViolations = pResults.summary.violations.filter(
    (pViolation) => pViolation.rule.severity !== "ignore",
  );

  if (lNonIgnorableViolations.length === 0) {
    return `${EOL}${styleText("green", "✔")} no dependency violations found (${
      pResults.summary.totalCruised
    } modules, ${
      pResults.summary.totalDependenciesCruised
    } dependencies cruised)${EOL}`
      .concat(formatIgnoreWarning(pResults.summary.ignore))
      .concat(
        formatStaleBaselineMessage(
          pResults.summary.baselineStale,
          pResults.summary.optionsUsed?.baseline?.staleEntriesSeverity,
        ),
      )
      .concat(formatEnvironmentIssues(pResults.summary.environment?.issues))
      .concat(EOL);
  }

  return lNonIgnorableViolations
    .reverse()
    .map(addExplanation(pResults.summary.ruleSetUsed, lOptions.long))
    .reduce(
      (pAll, pThis) => `${pAll}  ${formatViolation(pThis, lOptions)}${EOL}`,
      EOL,
    )
    .concat(formatSummary(pResults.summary))
    .concat(formatIgnoreWarning(pResults.summary.ignore))
    .concat(formatStaleBaselineMessage(pResults.summary.baselineStale))
    .concat(formatEnvironmentIssues(pResults.summary.environment?.issues))
    .concat(EOL);
}

/**
 * Returns the results of a cruise in a text only format, reminiscent of how eslint
 * prints to stdout:
 * - for each violation a message stating the violation name and the to and from
 * - a summary with total number of errors and warnings found, and the total
 *   number of files cruised
 * @param {ICruiseResult} pResults
 * @param {IErrorReporterOptions} pOptions
 * @returns {IReporterOutput}
 */
export default function error(pResults, pOptions) {
  return {
    output: report(pResults, pOptions || {}),
    // advisedExitCode is a mandatory attribute as of dependency-cruiser 18.4.0
    // however, this reporter can still encounter dependency-cruiser results
    // from before that, hence the fallback
    exitCode: pResults.summary.advisedExitCode ?? pResults.summary.error,
  };
}
