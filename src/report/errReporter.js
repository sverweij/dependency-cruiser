"use strict";

const chalk = require('chalk');

const SEVERITY2CHALK = {
    'error' : chalk.red,
    'warn'  : chalk.yellow,
    'info'  : chalk.cyan
};

function formatError(pErr) {
    return `${SEVERITY2CHALK[pErr.rule.severity](pErr.rule.severity)} ${pErr.rule.name}: ` +
           `${chalk.bold(pErr.source)} => ${chalk.bold(pErr.resolved)}`;
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

function render(pInput) {
    let lViolations = pInput
        .map(cutNonTransgressions)
        .filter(pDep => pDep.dependencies.length > 0)
        .sort((pOne, pTwo) => pOne.source > pTwo.source ? 1 : -1)
        .reduce(
            (pAll, pThis) => pAll.concat(pThis.dependencies.map(addSource(pThis.source))),
            []
        );

    if (lViolations.length === 0){
        return {
            content: ""
        };
    }

    let lMeta = lViolations.reduce(
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

    return {
        content: lViolations.reduce(
                (pAll, pThis) => `${pAll}    ${formatError(pThis)}\n`,
                "\n"
            ).concat(
                chalk.red(`\n  ${lMeta.error > 0 ? `${lMeta.error} errors` : ""} found\n\n`)
            ),
        meta: lMeta
    };

}

module.exports = render;
