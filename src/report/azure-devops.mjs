/*
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

import { EOL } from "node:os";

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

/**
 *
 * @param {import("../../types/violations.js").IViolation} pViolation
 */
function formatViolation(pViolation) {
  return `##vso[task.logissue type=${formatSeverity(
    pViolation.rule.severity
  )};sourcepath=${pViolation.from}]${pViolation.rule.name}`;
}

/**
 *
 * @param {number} pNumberOfErrors
 * @returns
 */
function formatSuccess(pNumberOfErrors) {
  return pNumberOfErrors === 0 ? "Succeeded" : "Failed";
}

/**
 *
 * @param {import("../../types/cruise-result.js").ISummary} pSummary
 */
function formatSummary(pSummary) {
  return `##vso[task.complete result=${formatSuccess(pSummary.error)};] ${
    pSummary.totalCruised
  } modules, ${pSummary.totalDependenciesCruised} dependencies cruised`;
}

/**
 * Returns a bunch of Azure DevOps log messages:
 * - for each violated rule in the passed results: gnork
 * - for each violation in the passed results: bork
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
  const lIgnoredCount = pResults?.summary?.ignore ?? 0;

  return {
    output: lViolations
      .map(formatViolation)
      .join(EOL)
      .concat(EOL)
      .concat(formatSummary(pResults.summary))
      .concat(EOL),
    exitCode: pResults.summary.error,
  };
}
