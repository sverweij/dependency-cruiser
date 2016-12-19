"use strict";

function cutNonTransgressions(pSourceEntry) {
    return {
        source       : pSourceEntry.source,
        dependencies : pSourceEntry.dependencies.filter(pDep => pDep.valid === false)
    };
}

function addSource(pSource) {
    return pDependency => Object.assign(
        {
            from: pSource,
            to: pDependency.resolved,
            rule: pDependency.rule
        }
    );
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

module.exports = (pDependencies) => {
    const lViolations = extractViolations(pDependencies);

    return Object.assign(
        {
            violations : lViolations
        },
        extractMetaData(lViolations)
    );
};
