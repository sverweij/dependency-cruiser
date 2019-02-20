const chalk   = require('chalk');
const figures = require('figures');

const SEVERITY2CHALK = {
    'error' : chalk.red,
    'warn'  : chalk.yellow,
    'info'  : chalk.cyan
};

function formatError(pErr) {
    return `${SEVERITY2CHALK[pErr.rule.severity](pErr.rule.severity)} ${pErr.rule.name}: ` +
           `${chalk.bold(pErr.from)} ${figures.arrowRight} ${chalk.bold(pErr.to)}` +
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

module.exports = (pInput) => {

    if (pInput.summary.violations.length === 0){
        return Object.assign(
            pInput,
            {
                modules:
                    `\n${chalk.green(figures.tick)} no dependency violations found (${pInput.summary.totalCruised} modules cruised)\n\n`
            }
        );
    }

    return Object.assign(
        {},
        pInput,
        {
            modules: pInput.summary.violations.reduce(
                (pAll, pThis) => `${pAll}  ${formatError(pThis)}\n`,
                "\n"
            ).concat(
                formatSummary(pInput.summary)
            )
        }
    );

};

/* eslint max-len: 0 */
