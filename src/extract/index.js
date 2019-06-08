const _               = require('lodash');
const _get            = require('lodash/get');
const pathToPosix     = require('./utl/pathToPosix');
const extract         = require('./extract');
const deriveCirculars = require('./derive/circular');
const deriveOrphans   = require('./derive/orphan');
const deriveReachable = require('./derive/reachable');
const gather          = require('./gatherInitialSources');
const summarize       = require('./summarize');
const addValidations  = require('./addValidations');
const clearCaches     = require('./clearCaches');

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
    const SHAREABLE_OPTIONS = [
        "args",
        "combinedDependencies",
        "doNotFollow",
        "exclude",
        "externalModuleResolutionStrategy",
        "includeOnly",
        "maxDepth",
        "moduleSystems",
        "outputTo",
        "outputType",
        "prefix",
        "preserveSymlinks",
        "rulesFile",
        "tsPreCompilationDeps",
        "webpackConfig"
    ];

    return SHAREABLE_OPTIONS
        .filter(pOption => pOptions.hasOwnProperty(pOption) && pOptions[pOption] !== 0)
        .filter(pOption => pOption !== "doNotFollow" || Object.keys(pOptions.doNotFollow).length > 0)
        .reduce(
            (pAll, pOption) => {
                pAll[pOption] = pOptions[pOption];
                return pAll;
            },
            {}
        );
}

function addRuleSetUsed(pOptions) {
    const lForbidden = _get(pOptions, "ruleSet.forbidden");
    const lAllowed = _get(pOptions, "ruleSet.allowed");
    const lAllowedSeverity = _get(pOptions, "ruleSet.allowedSeverity");

    return Object.assign(
        lForbidden ? {forbidden: lForbidden} : {},
        lAllowed ? {allowed: lAllowed} : {},
        lAllowedSeverity ? {allowedSeverity: lAllowedSeverity} : {}
    );
}

module.exports = (pFileDirArray, pOptions, pResolveOptions, pTSConfig) => {
    clearCaches();

    let lModules = _(
        extractFileDirArray(pFileDirArray, pOptions, pResolveOptions, pTSConfig).reduce(complete, [])
    ).uniqBy(pDependency => pDependency.source)
        .value();

    lModules = deriveCirculars(lModules, pOptions);
    lModules = deriveOrphans(lModules, pOptions);
    lModules = deriveReachable(lModules, pOptions.ruleSet);


    lModules = addValidations(
        lModules,
        pOptions.validate,
        pOptions.ruleSet
    );

    return {
        modules : lModules,
        summary :
            Object.assign(
                summarize(lModules),
                {
                    optionsUsed: makeOptionsPresentable(pOptions)
                },
                pOptions.ruleSet
                    ? {ruleSetUsed: addRuleSetUsed(pOptions)}
                    : {}
            )
    };
};

/* eslint security/detect-object-injection: 0 */
