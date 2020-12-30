const chalk = require("chalk");
const figures = require("figures");

const _get = require("lodash/get");
const { findRuleByName } = require("../graph-utl/rule-set");
const wrapAndIndent = require("../utl/wrap-and-indent");

const SEVERITY2CHALK = {
  error: chalk.red,
  warn: chalk.yellow,
  info: chalk.cyan,
};

const CYCLIC_PATH_INDENT = 6;

function renderExtraPathInformation(pExtra) {
  return "\n".concat(
    wrapAndIndent(pExtra.join(` ${figures.arrowRight} \n`), CYCLIC_PATH_INDENT)
  );
}
function determineTo(pViolation) {
  if (pViolation.cycle) {
    return renderExtraPathInformation(pViolation.cycle);
  }
  if (pViolation.via) {
    return `${chalk.bold(pViolation.to)}${renderExtraPathInformation(
      pViolation.via
    )}`;
  }
  return `${chalk.bold(pViolation.to)}`;
}

function formatViolation(pViolation) {
  const lModuleNames =
    pViolation.from === pViolation.to
      ? chalk.bold(pViolation.from)
      : `${chalk.bold(pViolation.from)} ${figures.arrowRight} ${determineTo(
          pViolation
        )}`;

  return (
    `${SEVERITY2CHALK[pViolation.rule.severity](pViolation.rule.severity)} ${
      pViolation.rule.name
    }: ${lModuleNames}` +
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
  } modules, ${pSummary.totalDependenciesCruised} dependencies cruised.\n\n`;

  return pSummary.error > 0 ? chalk.red(lMessage) : lMessage;
}

function addExplanation(pRuleSet, pLong) {
  return pLong
    ? (pViolation) => ({
        ...pViolation,
        comment: _get(
          findRuleByName(pRuleSet, pViolation.rule.name),
          "comment",
          "-"
        ),
      })
    : (pViolation) => pViolation;
}

function report(pResults, pLong) {
  if (pResults.summary.violations.length === 0) {
    return `\n${chalk.green(figures.tick)} no dependency violations found (${
      pResults.summary.totalCruised
    } modules, ${
      pResults.summary.totalDependenciesCruised
    } dependencies cruised)\n\n`;
  }

  return pResults.summary.violations
    .reverse()
    .map(addExplanation(pResults.summary.ruleSetUsed, pLong))
    .reduce((pAll, pThis) => `${pAll}  ${formatViolation(pThis)}\n`, "\n")
    .concat(formatSummary(pResults.summary));
}

/**
 * Returns the results of a cruise in a text only format, reminiscent of how eslint
 * prints to stdout:
 * - for each violation a message stating the violation name and the to and from
 * - a summary with total number of errors and warnings found, and the total
 *   number of files cruised
 * @param {ICruiseResult} pResults -
 * @param {any} pOptions - An object with options;
 *                         {boolean} long - whether or not to include an explanation
 *                                          (/ comment) which each violation
 * @returns {IReporterOutput} - output: the formatted text in a string
 *                              exitCode: the number of errors found
 */
module.exports = (pResults, pOptions) => ({
  output: report(pResults, (pOptions || {}).long),
  exitCode: pResults.summary.error,
});
