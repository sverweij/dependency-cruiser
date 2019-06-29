const chalk          = require('chalk');
const figures        = require('figures');
const indentString   = require('indent-string');
const wrapAnsi       = require('wrap-ansi');
const _get           = require('lodash/get');
const findRuleByName = require('./utl/findRuleByName');

const SEVERITY2CHALK = {
    'error' : chalk.red,
    'warn'  : chalk.yellow,
    'info'  : chalk.cyan
};

function wrapAndIndent(pString) {
    const INDENT = 4;
    const DOGMATIC_MAX_CONSOLE_WIDTH = 78;
    const MAX_WIDTH = DOGMATIC_MAX_CONSOLE_WIDTH - INDENT;

    return indentString(wrapAnsi(pString, MAX_WIDTH), INDENT);
}


function formatError(pErr) {
    const lModuleNames = pErr.from === pErr.to
        ? chalk.bold(pErr.from)
        : `${chalk.bold(pErr.from)} ${figures.arrowRight} ${chalk.bold(pErr.to)}`;

    return `${SEVERITY2CHALK[pErr.rule.severity](pErr.rule.severity)} ${pErr.rule.name}: ${lModuleNames}` +
           `${pErr.comment ? `\n${wrapAndIndent(chalk.dim(pErr.comment))}\n` : ""}`;
}

function formatMeta(pMeta) {
    return `${pMeta.error} errors, ${pMeta.warn} warnings`;
}

function sumMeta(pMeta) {
    return pMeta.error + pMeta.warn + pMeta.info;
}

function formatSummary(pSummary) {
    let lMessage =
        `\n${figures.cross} ${sumMeta(pSummary)} dependency violations (${formatMeta(pSummary)}). ${pSummary.totalCruised} modules, ${pSummary.totalDependenciesCruised} dependencies cruised.\n\n`;

    return pSummary.error > 0 ? chalk.red(lMessage) : lMessage;
}

function addExplanation(pRuleSet, pLong) {
    return pLong
        ? (pViolation) =>
            Object.assign(
                {},
                pViolation,
                {
                    comment: _get(findRuleByName(pRuleSet, pViolation.rule.name), 'comment', '-')
                }
            )
        : pViolation => pViolation;
}

/**
 * Returns the results of a cruise in a text only format, reminiscent of how eslint prints
 * to stdout:
 * - for each violation a message stating the violation name and the to and from
 * - a summary with total number of errors and warnings found, and the total number of files cruised
 *
 * @param {any} pResults - the output of a dependency-cruise adhering to ../extract/results-schema.json
 * @param {boolean} pLong - whether or not to include an explanation (/ comment) which each violation
 * @returns {string} - eslint like output
 */
module.exports = (pResults, pLong = false) => {

    if (pResults.summary.violations.length === 0){
        return `\n${chalk.green(figures.tick)} no dependency violations found (${pResults.summary.totalCruised} modules, ${pResults.summary.totalDependenciesCruised} dependencies cruised)\n\n`;
    }

    return pResults.summary.violations.reverse().map(addExplanation(pResults.summary.ruleSetUsed, pLong)).reduce(
        (pAll, pThis) => `${pAll}  ${formatError(pThis)}\n`,
        "\n"
    ).concat(
        formatSummary(pResults.summary)
    );

};

/* eslint max-len: 0 */
