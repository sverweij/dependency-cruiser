"use strict";

const _                      = require('lodash');
const pathToPosix            = require('../utl/pathToPosix');
const extract                = require('./extract');
const deriveCirculars        = require('./derive/circular');
const deriveOrphans          = require('./derive/orphan');
const gather                 = require('./gatherInitialSources');
const summarize              = require('./summarize');
const addValidations         = require('./addValidations');

/* eslint max-params:0 */
function extractRecursive (pFileName, pOptions, pVisited, pDepth, pResolveOptions, pTSConfig) {
    pVisited.add(pFileName);
    const lDependencies = (pOptions.maxDepth <= 0 || pDepth < pOptions.maxDepth)
        ? extract(pFileName, pOptions, pResolveOptions, pTSConfig)
        : [];

    return lDependencies
        .filter(pDep => pDep.followable && !pDep.matchesDoNotFollow)
        .reduce(
            (pAll, pDep) => {
                if (!pVisited.has(pDep.resolved)){
                    return pAll.concat(
                        extractRecursive(pDep.resolved, pOptions, pVisited, pDepth + 1, pResolveOptions, pTSConfig)
                    );
                }
                return pAll;
            }, [{
                source: pathToPosix(pFileName),
                dependencies: lDependencies
            }]
        );
}

function extractFileDirArray(pFileDirArray, pOptions, pResolveOptions, pTSConfig) {
    let lVisited = new Set();

    return _.spread(_.concat)(
        gather(pFileDirArray, pOptions)
            .reduce((pDependencies, pFilename) => {
                if (!lVisited.has(pFilename)){
                    lVisited.add(pFilename);
                    return pDependencies.concat(
                        extractRecursive(pFilename, pOptions, lVisited, 0, pResolveOptions, pTSConfig)
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
        matchesDoNotFollow: pToListItem.matchesDoNotFollow,
        dependencyTypes : pToListItem.dependencyTypes,
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

function makeOptionsPresentable(pOptions) {
    const SHARABLE_OPTIONS = [
        "rulesFile",
        "outputTo",
        "doNotFollow",
        "exclude",
        "maxDepth",
        "moduleSystems",
        "outputType",
        "prefix",
        "tsPreCompilationDeps",
        "preserveSymlinks",
        "webpackConfig"
    ];

    return SHARABLE_OPTIONS
        .filter(pOption => pOptions.hasOwnProperty(pOption) && pOptions[pOption] !== 0)
        .reduce(
            (pAll, pOption) => {
                pAll[pOption] = pOptions[pOption];
                return pAll;
            },
            {}
        );
}

module.exports = (pFileDirArray, pOptions, pCallback, pResolveOptions, pTSConfig) => {
    const lCallback = pCallback ? pCallback : (pInput => pInput);
    const lOptions = Object.assign(
        {
            maxDepth: 0
        },
        pOptions
    );

    let lModules = _(
        extractFileDirArray(pFileDirArray, lOptions, pResolveOptions, pTSConfig).reduce(complete, [])
    ).uniqBy(pDependency => pDependency.source)
        .value();

    lModules = deriveCirculars(lModules, lOptions);
    lModules = deriveOrphans(lModules, lOptions);

    lModules = addValidations(
        lModules,
        lOptions.validate,
        lOptions.ruleSet
    );

    return lCallback(
        {
            modules : lModules,
            summary :
                Object.assign(
                    summarize(lModules),
                    {
                        optionsUsed: makeOptionsPresentable(lOptions)
                    }
                )
        }
    );
};

/* eslint security/detect-object-injection: 0 */
