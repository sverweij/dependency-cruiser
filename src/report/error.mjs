import { EOL } from "node:os";
import chalk from "chalk";
import figures from "figures";
import {
  formatPercentage,
  formatViolation as _formatViolation,
} from "./utl/index.mjs";
import { findRuleByName } from "#graph-utl/rule-set.mjs";
import wrapAndIndent from "#utl/wrap-and-indent.mjs";

const SEVERITY2CHALK = new Map([
  ["error", chalk.red],
  ["warn", chalk.yellow],
  ["info", chalk.cyan],
  ["ignore", chalk.gray],
]);

const EXTRA_PATH_INFORMATION_INDENT = 6;

function formatMiniDependency(pMiniDependency) {
  return EOL.concat(
    wrapAndIndent(
      pMiniDependency
        .map(({ name }) => name)
        .join(` ${figures.arrowRight} ${EOL}`),
      EXTRA_PATH_INFORMATION_INDENT,
    ),
  );
}

function formatModuleViolation(pViolation) {
  return chalk.bold(pViolation.from);
}

function formatDependencyViolation(pViolation) {
  return `${chalk.bold(pViolation.from)} ${figures.arrowRight} ${chalk.bold(
    pViolation.to,
  )}`;
}

function formatCycleViolation(pViolation) {
  return `${chalk.bold(pViolation.from)} ${
    figures.arrowRight
  } ${formatMiniDependency(pViolation.cycle)}`;
}

function formatReachabilityViolation(pViolation) {
  return `${chalk.bold(pViolation.from)} ${figures.arrowRight} ${chalk.bold(
    pViolation.to,
  )}${formatMiniDependency(pViolation.via)}`;
}

function formatInstabilityViolation(pViolation) {
  return `${formatDependencyViolation(pViolation)}${EOL}${wrapAndIndent(
    chalk.dim(
      `instability: ${formatPercentage(pViolation.metrics.from.instability)} ${
        figures.arrowRight
      } ${formatPercentage(pViolation.metrics.to.instability)}`,
    ),
    EXTRA_PATH_INFORMATION_INDENT,
  )}`;
}

function formatViolation(pViolation) {
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
  );

  return (
    `${SEVERITY2CHALK.get(pViolation.rule.severity)(
      pViolation.rule.severity,
    )} ${pViolation.rule.name}: ${lFormattedViolators}` +
    `${
      pViolation.comment
        ? `${EOL}${wrapAndIndent(chalk.dim(pViolation.comment))}${EOL}`
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
  let lMessage = `${EOL}${figures.cross} ${sumMeta(
    pSummary,
  )} dependency violations (${formatMeta(pSummary)}). ${
    pSummary.totalCruised
  } modules, ${pSummary.totalDependenciesCruised} dependencies cruised.${EOL}`;

  return pSummary.error > 0 ? chalk.red(lMessage) : lMessage;
}

function addExplanation(pRuleSet, pLong) {
  return pLong
    ? (pViolation) => ({
        ...pViolation,
        comment: findRuleByName(pRuleSet, pViolation.rule.name)?.comment ?? "-",
      })
    : (pViolation) => pViolation;
}

function formatIgnoreWarning(pNumberOfIgnoredViolations) {
  if (pNumberOfIgnoredViolations > 0) {
    return chalk.yellow(
      `${figures.warning} ${pNumberOfIgnoredViolations} known violations ignored. Run with --no-ignore-known to see them.${EOL}`,
    );
  }
  return "";
}

function report(pResults, pLong) {
  const lNonIgnorableViolations = pResults.summary.violations.filter(
    (pViolation) => pViolation.rule.severity !== "ignore",
  );

  if (lNonIgnorableViolations.length === 0) {
    return `${EOL}${chalk.green(
      figures.tick,
    )} no dependency violations found (${
      pResults.summary.totalCruised
    } modules, ${
      pResults.summary.totalDependenciesCruised
    } dependencies cruised)${EOL}${formatIgnoreWarning(
      pResults.summary.ignore,
    )}${EOL}`;
  }

  return lNonIgnorableViolations
    .reverse()
    .map(addExplanation(pResults.summary.ruleSetUsed, pLong))
    .reduce((pAll, pThis) => `${pAll}  ${formatViolation(pThis)}${EOL}`, EOL)
    .concat(formatSummary(pResults.summary))
    .concat(formatIgnoreWarning(pResults.summary.ignore))
    .concat(EOL);
}

/**
 * Returns the results of a cruise in a text only format, reminiscent of how eslint
 * prints to stdout:
 * - for each violation a message stating the violation name and the to and from
 * - a summary with total number of errors and warnings found, and the total
 *   number of files cruised
 * @param {import("../../types/cruise-result.mjs").ICruiseResult} pResults -
 * @param {any} pOptions - An object with options;
 *                         {boolean} long - whether or not to include an explanation
 *                                          (/ comment) which each violation
 * @returns {import("../../types/dependency-cruiser.js").IReporterOutput} - output: the formatted text in a string
 *                              exitCode: the number of errors found
 */
export default function error(pResults, pOptions) {
  return {
    output: report(pResults, (pOptions || {}).long),
    exitCode: pResults.summary.error,
  };
}
