const chalk   = require('chalk');
const figures = require('figures');

const SEVERITY2CHALK = {
    'error' : chalk.red,
    'warn'  : chalk.yellow,
    'info'  : chalk.cyan
};

function formatError(pErr) {
    const lModuleNames = pErr.from === pErr.to
        ? chalk.bold(pErr.from)
        : `${chalk.bold(pErr.from)} ${figures.arrowRight} ${chalk.bold(pErr.to)}`;

    return `${SEVERITY2CHALK[pErr.rule.severity](pErr.rule.severity)} ${pErr.rule.name}: ${lModuleNames}` +
           `${pErr.additionalInformation ? `\n  ${pErr.additionalInformation}` : ""}`;
}

function formatMeta(pMeta) {
    return `${pMeta.error} errors, ${pMeta.warn} warnings`;
}

function sumMeta(pMeta) {
    return pMeta.error + pMeta.warn + pMeta.info;
}

function formatSummary(pMeta) {
    let lMessage =
        `\n${figures.cross} ${sumMeta(pMeta)} dependency violations (${formatMeta(pMeta)}). ${pMeta.totalCruised} modules cruised.\n\n`;

    return pMeta.error > 0 ? chalk.red(lMessage) : lMessage;
}

/**
 * Returns the results of a cruise in a text only format, reminiscent of how eslint prints
 * to stdout:
 * - for each violation a message stating the violation name and the to and from
 * - a summary with total number of errors and warnings found, and the total number of files cruised
 *
 * @param {any} pResults - the output of a dependency-cruise adhering to ../extract/results-schema.json
 * @returns {string} - eslint like output
 */
module.exports = (pResults) => {

    if (pResults.summary.violations.length === 0){
        return `\n${chalk.green(figures.tick)} no dependency violations found (${pResults.summary.totalCruised} modules cruised)\n\n`;
    }

    return pResults.summary.violations.reduce(
        (pAll, pThis) => `${pAll}  ${formatError(pThis)}\n`,
        "\n"
    ).concat(
        formatSummary(pResults.summary)
    );

};

/* eslint max-len: 0 */
