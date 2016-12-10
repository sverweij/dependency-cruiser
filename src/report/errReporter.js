"use strict";

const chalk   = require('chalk');
const figures = require('figures');

const SEVERITY2CHALK = {
    'error' : chalk.red,
    'warn'  : chalk.yellow,
    'info'  : chalk.cyan
};

function formatError(pErr) {
    return `${SEVERITY2CHALK[pErr.rule.severity](pErr.rule.severity)} ${pErr.rule.name}: ` +
           `${chalk.bold(pErr.source)} ${figures.arrowRight} ${chalk.bold(pErr.resolved)}`;
}

function formatMeta(pMeta) {
    return `${pMeta.error} errors, ${pMeta.warn} warnings`;
}

function sumMeta(pMeta) {
    return pMeta.error + pMeta.warn + pMeta.info;
}

function formatSummary(pMeta) {
    let lMessage = `\n${figures.cross} ${sumMeta(pMeta)} violations (${formatMeta(pMeta)}) \n\n`;

    return pMeta.error > 0 ? chalk.red(lMessage) : lMessage;
}

function cutNonTransgressions(pSourceEntry) {
    return {
        source: pSourceEntry.source,
        dependencies: pSourceEntry.dependencies.filter(pDep => pDep.valid === false)
    };
}

function addSource(pSource) {
    return pDependency => Object.assign(pDependency, {source: pSource});
}

function extractMetaData(pViolations) {
    return pViolations.reduce(
        (pAll, pThis) => {
            pAll[pThis.rule.severity] += 1;
            return pAll;
        }
        , {
            error : 0,
            warn  : 0,
            info  : 0
        }
    );
}

function extractViolations(pInput){
    return pInput
        .map(cutNonTransgressions)
        .filter(pDep => pDep.dependencies.length > 0)
        .sort((pOne, pTwo) => pOne.source > pTwo.source ? 1 : -1)
        .reduce(
            (pAll, pThis) => pAll.concat(pThis.dependencies.map(addSource(pThis.source))),
            []
        );
}

function render(pInput) {
    const lViolations = extractViolations(pInput);

    if (lViolations.length === 0){
        return {
            dependencies: ""
        };
    }

    const lMetaData = extractMetaData(lViolations);

    return {
        dependencies: lViolations.reduce(
                (pAll, pThis) => `${pAll}  ${formatError(pThis)}\n`,
                "\n"
            ).concat(
                formatSummary(lMetaData)
            ),
        metaData: lMetaData
    };

}

module.exports = render;
