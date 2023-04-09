import chalk from "chalk";
import figures from "figures";
import { findRuleByName } from "../graph-utl/rule-set.mjs";
import wrapAndIndent from "../utl/wrap-and-indent.mjs";
import {
  formatPercentage,
  formatViolation as _formatViolation,
} from "./utl/index.mjs";

const SEVERITY2CHALK = {
  error: chalk.red,
  warn: chalk.yellow,
  info: chalk.cyan,
  ignore: chalk.gray,
};

const EXTRA_PATH_INFORMATION_INDENT = 6;

function formatExtraPathInformation(pExtra) {
  return "\n".concat(
    wrapAndIndent(
      pExtra.join(` ${figures.arrowRight} \n`),
      EXTRA_PATH_INFORMATION_INDENT
    )
  );
}

function formatModuleViolation(pViolation) {
  return chalk.bold(pViolation.from);
}

function formatDependencyViolation(pViolation) {
  return `${chalk.bold(pViolation.from)} ${figures.arrowRight} ${chalk.bold(
    pViolation.to
  )}`;
}

function formatCycleViolation(pViolation) {
  return `${chalk.bold(pViolation.from)} ${
    figures.arrowRight
  } ${formatExtraPathInformation(pViolation.cycle)}`;
}

function formatReachabilityViolation(pViolation) {
  return `${chalk.bold(pViolation.from)} ${figures.arrowRight} ${chalk.bold(
    pViolation.to
  )}${formatExtraPathInformation(pViolation.via)}`;
}

function formatInstabilityViolation(pViolation) {
  return `${formatDependencyViolation(pViolation)}\n${wrapAndIndent(
    chalk.dim(
      `instability: ${formatPercentage(pViolation.metrics.from.instability)} ${
        figures.arrowRight
      } ${formatPercentage(pViolation.metrics.to.instability)}`
    ),
    EXTRA_PATH_INFORMATION_INDENT
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
    formatDependencyViolation
  );

  return (
    `${SEVERITY2CHALK[pViolation.rule.severity](pViolation.rule.severity)} ${
      pViolation.rule.name
    }: ${lFormattedViolators}` +
    `${
      pViolation.comment
        ? `\n${wrapAndIndent(chalk.dim(pViolation.comment))}\n`
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
  let lMessage = `\n${figures.cross} ${sumMeta(
    pSummary
  )} dependency violations (${formatMeta(pSummary)}). ${
    pSummary.totalCruised
  } modules, ${pSummary.totalDependenciesCruised} dependencies cruised.\n`;

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
      `${figures.warning} ${pNumberOfIgnoredViolations} known violations ignored. Run with --no-ignore-known to see them.\n`
    );
  }
  return "";
}

function report(pResults, pLong) {
  const lNonIgnorableViolations = pResults.summary.violations.filter(
    (pViolation) => pViolation.rule.severity !== "ignore"
  );

  if (lNonIgnorableViolations.length === 0) {
    return `\n${chalk.green(figures.tick)} no dependency violations found (${
      pResults.summary.totalCruised
    } modules, ${
      pResults.summary.totalDependenciesCruised
    } dependencies cruised)\n${formatIgnoreWarning(
      pResults.summary.ignore
    )}\n\n`;
  }

  return lNonIgnorableViolations
    .reverse()
    .map(addExplanation(pResults.summary.ruleSetUsed, pLong))
    .reduce((pAll, pThis) => `${pAll}  ${formatViolation(pThis)}\n`, "\n")
    .concat(formatSummary(pResults.summary))
    .concat(formatIgnoreWarning(pResults.summary.ignore))
    .concat(`\n`);
}

/**
 * Returns the results of a cruise in a text only format, reminiscent of how eslint
 * prints to stdout:
 * - for each violation a message stating the violation name and the to and from
 * - a summary with total number of errors and warnings found, and the total
 *   number of files cruised
 * @param {import("../../types/cruise-result.js").ICruiseResult} pResults -
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
