import { EOL } from "node:os";
import {
  formatPercentage,
  formatViolation as _formatViolation,
} from "./utl/index.mjs";

const SEVERITY2VSO_TYPE = new Map([
  // "error" | "warn" | "info" | "ignore"
  ["error", "error"],
  ["warn", "warning"],
  // azure devops doesn't seem to know 'info'. We still want to
  // show them, though, hence:
  ["info", "warning"],
]);

/**
 * @param {import("../../types/shared-types.js").SeverityType} pSeverity
 * @returns {string}
 */
function formatSeverity(pSeverity) {
  return SEVERITY2VSO_TYPE.get(pSeverity) ?? "warning";
}

/**
 * @param {import("../../types/violations.js").IViolation} pViolation
 * @returns {string}
 */
function formatModuleViolation(pViolation) {
  return pViolation.from;
}

/**
 * @param {import("../../types/violations.js").IViolation} pViolation
 * @returns {string}
 */
function formatDependencyViolation(pViolation) {
  return `${pViolation.from} -> ${pViolation.to}`;
}

/**
 * @param {import("../../types/violations.js").IViolation} pViolation
 * @returns {string}
 */
function formatCycleViolation(pViolation) {
  return `${pViolation.from} -> ${pViolation.cycle
    .map(({ name }) => name)
    .join(" -> ")}`;
}

/**
 * @param {import("../../types/violations.js").IViolation} pViolation
 * @returns {string}
 */
function formatReachabilityViolation(pViolation) {
  return `${pViolation.from} -> ${pViolation.to} (via ${pViolation.via
    .map(({ name }) => name)
    .join(" -> ")})`;
}

/**
 * @param {import("../../types/violations.js").IViolation} pViolation
 * @returns {string}
 */
function formatInstabilityViolation(pViolation) {
  return `${pViolation.from} -> ${
    pViolation.to
  } (instability: ${formatPercentage(
    pViolation.metrics.from.instability,
  )} -> ${formatPercentage(pViolation.metrics.to.instability)})`;
}

/**
 * @param {import("../../types/violations.js").IViolation} pViolation
 * @returns {string}
 */
function formatViolation(pViolation) {
  const lViolationType2Formatter = {
    module: formatModuleViolation,
    dependency: formatDependencyViolation,
    cycle: formatCycleViolation,
    reachability: formatReachabilityViolation,
    instability: formatInstabilityViolation,
  };
  let lFormattedViolators = _formatViolation(
    pViolation,
    lViolationType2Formatter,
    formatDependencyViolation,
  );
  return `##vso[task.logissue type=${formatSeverity(
    pViolation.rule.severity,
  )};sourcepath=${pViolation.from};code=${
    pViolation.rule.name
  };]${lFormattedViolators}${EOL}`;
}

/**
 * @param {number} pNumberOfErrors
 *
 * @returns {string}
 */
function formatResultStatus(pNumberOfErrors) {
  return pNumberOfErrors > 0 ? "Failed" : "Succeeded";
}

/**
 * @param {import("../../types/cruise-result.mjs").ISummary} pMeta
 * @returns {string}
 */
function formatMeta(pMeta) {
  const lWarningCount = pMeta.warn + pMeta.info;
  const lError = `${pMeta.error} error`;
  const lWarn = `${lWarningCount} warning/ informational`;
  const lIgnore = (pMeta?.ignore ?? 0) > 0 ? `, ${pMeta.ignore} ignored` : "";

  return `${lError}, ${lWarn}${lIgnore}`;
}

function sumMeta(pMeta) {
  return pMeta.error + pMeta.warn + pMeta.info;
}

/**
 * @param {number} pNumberOfIgnored
 * @returns {string}
 */
function formatIgnoreWarning(pNumberOfIgnored) {
  return (pNumberOfIgnored ?? 0) > 0
    ? ` - ${pNumberOfIgnored} violations ignored `
    : "";
}

/**
 * @param {import("../../types/cruise-result.mjs").ISummary} pSummary
 * @returns {string}
 */
function formatResultMessage(pSummary) {
  let lStatSummary = `${pSummary.totalCruised} modules, ${
    pSummary?.totalDependenciesCruised ?? 0
  } dependencies cruised`;

  if (sumMeta(pSummary) > 0) {
    return `${sumMeta(pSummary)} dependency violations (${formatMeta(
      pSummary,
    )}). ${lStatSummary}`;
  } else {
    return `no dependency violations found${formatIgnoreWarning(
      pSummary.ignore,
    )} (${lStatSummary})`;
  }
}

/**
 * @param {import("../../types/cruise-result.mjs").ISummary} pSummary
 * @returns {string}
 */
function formatSummary(pSummary) {
  return `##vso[task.complete result=${formatResultStatus(
    pSummary.error,
  )};]${formatResultMessage(pSummary)}${EOL}`;
}

/**
 * Returns a bunch of Azure DevOps log messages:
 * - for each violation in the passed results: the severity, source found, violated rule & some additional info
 * - a summary line
 *
 * Background documentation:
 * https://learn.microsoft.com/en-us/azure/devops/pipelines/scripts/logging-commands?view=azure-devops&tabs=bash#task-commands
 *
 * @param {import("../../types/dependency-cruiser.js").ICruiseResult} pResults
 * @returns {import("../../types/dependency-cruiser.js").IReporterOutput}
 */
// eslint-disable-next-line unicorn/prevent-abbreviations
export default function azureDevOps(pResults) {
  const lViolations = (pResults?.summary?.violations ?? []).filter(
    (pViolation) => pViolation.rule.severity !== "ignore",
  );

  return {
    output: lViolations
      .map(formatViolation)
      .join("")
      .concat(formatSummary(pResults.summary)),
    exitCode: pResults.summary.error,
  };
}

/*
Some notes from the documentation over at https://learn.microsoft.com/en-us/azure/devops/pipelines/scripts/logging-commands?view=azure-devops&tabs=bash#task-commands

Warnings and errors:

##vso[task.logissue type=warning;sourcepath=consoleapp/main.cs;linenumber=1;columnnumber=1;code=100;]Found something that could be a problem.

Progress
##vso[task.setprogress]current operation

Complete
##vso[task.complete]current operation

Message grouping
##[group]Beginning of a group
##[warning]Warning message
##[error]Error message
##[section]Start of a section
##[debug]Debug text
##[command]Command-line being run
##[endgroup]
*/
