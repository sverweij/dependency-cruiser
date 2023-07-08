import { EOL } from "node:os";
import {
  formatPercentage,
  formatViolation as _formatViolation,
} from "./utl/index.mjs";

const SEVERITY2VSO_TYPE = new Map([
  // "error" | "warn" | "info" | "ignore
  ["error", "error"],
  ["warn", "warning"],
  // azure devops doesn't seem to understand 'info'. We still want to
  // show them, though, hence:
  ["info", "warning"],
]);

/**
 *
 * @param {import("../../types/shared-types.js").SeverityType} pSeverity
 */
function formatSeverity(pSeverity) {
  return SEVERITY2VSO_TYPE.get(pSeverity) ?? "warning";
}

function formatModuleViolation(pViolation) {
  return `${pViolation.rule.name}: ${pViolation.from}`;
}

/**
 *
 * @param {import("../../types/violations.js").IViolation} pViolation
 * @returns {string}
 */
function formatDependencyViolation(pViolation) {
  return `${pViolation.rule.name}: ${pViolation.from} -> ${pViolation.to}`;
}

/**
 *
 * @param {import("../../types/violations.js").IViolation} pViolation
 */
function formatViolation(pViolation) {
  const lViolationType2Formatter = {
    module: formatModuleViolation,
    dependency: formatDependencyViolation,
    // cycle: formatCycleViolation,
    // reachability: formatReachabilityViolation,
    // instability: formatInstabilityViolation,
  };
  let lFormattedViolators = _formatViolation(
    pViolation,
    lViolationType2Formatter,
    formatDependencyViolation
  );
  return `##vso[task.logissue type=${formatSeverity(
    pViolation.rule.severity
  )};sourcepath=${pViolation.from}]${lFormattedViolators}${EOL}`;
}

/**
 *
 * @param {number} pNumberOfErrors
 * @param {number} pNumberOfWarns
 * @param {number} pNumberOfInfos
 *
 * @returns
 */
function formatResultStatus(pNumberOfErrors, pNumberOfWarns, pNumberOfInfos) {
  if (pNumberOfErrors > 0) {
    return "Failed";
  }
  if (pNumberOfWarns + pNumberOfInfos > 0) {
    return "SucceededWithIssues";
  }
  return "Succeeded";
}

function formatMeta(pMeta) {
  return `${pMeta.error} error, ${
    pMeta.warn + pMeta.info
  } warning/ informational`;
}

function sumMeta(pMeta) {
  return pMeta.error + pMeta.warn + pMeta.info;
}

/**
 *
 * @param {import("../../types/cruise-result.js").ISummary} pSummary
 */
function formatResultMessage(pSummary) {
  let lStatSummary = `${pSummary.totalCruised} modules, ${
    pSummary?.totalDependenciesCruised ?? 0
  } dependencies cruised`;

  if (sumMeta(pSummary) > 0) {
    return `${sumMeta(pSummary)} dependency violations (${formatMeta(
      pSummary
    )}). ${lStatSummary}`;
  } else {
    return `no dependency violations found (${lStatSummary})`;
  }
}

/**
 *
 * @param {import("../../types/cruise-result.js").ISummary} pSummary
 */
function formatSummary(pSummary) {
  return `##vso[task.complete result=${formatResultStatus(
    pSummary.error,
    pSummary.warn,
    pSummary.info
  )};]${formatResultMessage(pSummary)}${EOL}`;
}

/**
 * Returns a bunch of Azure DevOps log messages:
 * - for each violation in the passed results: the severity, source found, violated rule & some additional info
 * - a summary line
 *
 * https://learn.microsoft.com/en-us/azure/devops/pipelines/scripts/logging-commands?view=azure-devops&tabs=bash#task-commands
 *
 * @param {import("../../types/dependency-cruiser.js").ICruiseResult} pResults
 * @returns {import("../../types/dependency-cruiser.js").IReporterOutput}
 */
// eslint-disable-next-line unicorn/prevent-abbreviations
export default function azureDevOps(pResults) {
  // this is the documented way to get tsm to emit strings
  // Alternatively we could've used the 'low level API', which
  // involves creating new `Message`s and stringifying those.
  // The abstraction of the 'higher level API' makes this
  // reporter more easy to implement and maintain, despite
  // setting this property directly

  const lViolations = (pResults?.summary?.violations ?? []).filter(
    (pViolation) => pViolation.rule.severity !== "ignore"
  );
  //   const lIgnoredCount = pResults?.summary?.ignore ?? 0;

  return {
    output: lViolations
      .map(formatViolation)
      .join("")
      .concat(formatSummary(pResults.summary)),
    exitCode: pResults.summary.error,
  };
}

/*
Some notes from the documentation on here:

https://learn.microsoft.com/en-us/azure/devops/pipelines/scripts/logging-commands?view=azure-devops&tabs=bash#task-commands

Message grouping
##[group]Beginning of a group
##[warning]Warning message
##[error]Error message
##[section]Start of a section
##[debug]Debug text
##[command]Command-line being run
##[endgroup]

Warnings and errors:

##vso[task.logissue type=warning;sourcepath=consoleapp/main.cs;linenumber=1;columnnumber=1;code=100;]Found something that could be a problem.

Progress
##vso[task.setprogress]current operation

Complete
##vso[task.complete]current operation
*/
