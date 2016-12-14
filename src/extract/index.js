"use strict";

const _       = require('lodash');

const extract = require('./extract');
const gather  = require('./gatherInitialSources');

function extractRecursive (pFileName, pOptions, pVisited) {
    pOptions = pOptions || {};
    pVisited = pVisited || new Set();
    pVisited.add(pFileName);

    let lRetval = [];
    const lDependencies = extract(pFileName, pOptions);

    lRetval.push({
        source: pFileName,
        dependencies: lDependencies
    });

    lDependencies
        .filter(pDep => pDep.followable)
        .forEach(
            pDep => {
                if (!pVisited.has(pDep.resolved)){
                    lRetval = lRetval.concat(
                        extractRecursive(pDep.resolved, pOptions, pVisited)
                    );
                }
            }
        );
    return lRetval;
}

function extractFileDirArray(pFileDirArray, pOptions) {
    let lVisited = new Set();

    return _.spread(_.concat)(
        gather(pFileDirArray, pOptions)
            .reduce((pDependencies, pFilename) => {
                if (!lVisited.has(pFilename)){
                    lVisited.add(pFilename);
                    return pDependencies.concat(
                        extractRecursive(pFilename, pOptions, lVisited)
                    );
                }
                return pDependencies;
            }, [])
    );
}

function isNotFollowable(pToDependency) {
    return !(pToDependency.followable);
}

function notInFromListAlready(pFromList) {
    return pToListItem =>
        !pFromList.some(pFromListItem => pFromListItem.source === pToListItem.resolved);
}

function toDependencyToSource(pToListItem) {
    return {
        source          : pToListItem.resolved,
        followable      : pToListItem.followable,
        coreModule      : pToListItem.coreModule,
        couldNotResolve : pToListItem.couldNotResolve,
        dependencies    : []
    };
}

function complete(pAll, pFromListItem) {
    return pAll
        .concat(pFromListItem)
        .concat(
            pFromListItem.dependencies
                .filter(isNotFollowable)
                .filter(notInFromListAlready(pAll))
                .map(toDependencyToSource)
        );
}

function cutNonTransgressions(pSourceEntry) {
    return {
        source: pSourceEntry.source,
        dependencies: pSourceEntry.dependencies.filter(pDep => pDep.valid === false)
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

function makeOptionsPresentable(pOptions) {
    const SHARABLE_OPTIONS = [
        "rulesFile",
        "outputTo",
        "exclude",
        "system",
        "outputType",
        "prefix"
    ];

    if (!Boolean(pOptions)){
        return {};
    }
    return SHARABLE_OPTIONS
        .filter(pOption => pOptions.hasOwnProperty(pOption))
        .reduce(
            (pAll, pOption) => {
                pAll[pOption] = pOptions[pOption];
                return pAll;
            },
            {}
        );
}

module.exports = (pFileDirArray, pOptions, pCallback) => {
    let lCallback = pCallback ? pCallback : (pInput => pInput);

    const lDependencies = _(
            extractFileDirArray(pFileDirArray, pOptions).reduce(complete, [])
        ).uniqBy(pDependency => pDependency.source)
         .value();
    const lViolations   = extractViolations(lDependencies);

    return lCallback(
        {
            dependencies : lDependencies,
            summary      :
                Object.assign(
                    {
                        violations : lViolations
                    },
                    extractMetaData(lViolations),
                    {
                        optionsUsed: makeOptionsPresentable(pOptions)
                    }
                )
        }
    );
};

/* eslint security/detect-object-injection: 0 */
