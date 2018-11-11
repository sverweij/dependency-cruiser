const _get = require('lodash/get');
const dependencyEndsUpAtFrom = require('./dependencyEndsUpAtFrom');

function circularityDetectionNecessary(pOptions) {
    if (pOptions.forceCircular) {
        return true;
    }
    if (pOptions.validate) {
        return _get(pOptions, 'ruleSet.forbidden', []).some(
            pRule => pRule.to.hasOwnProperty("circular")
        );
    }
    return false;
}

function addCircularityCheckToDependency (pToDep, pGraph, pFrom) {
    return Object.assign(
        {},
        pToDep,
        {
            circular: dependencyEndsUpAtFrom(pGraph, pFrom, pToDep.resolved)
        }
    );
}

/**
 * Runs through all dependencies, for each of them determines
 * whether it's (part of a) circular (relationship) and returns the
 * dependencies with that added.
 *
 * @param  {Object} pModules [description]
 * @return {Object}               the same dependencies, but for each
 *                                of them added whether or not it is
 *                                part of
 */
function addCircularityCheckToGraph (pModules) {
    return pModules.map(
        pModule => Object.assign(
            {},
            pModule,
            {
                dependencies: pModule.dependencies.map(
                    pToDep => addCircularityCheckToDependency(pToDep, pModules, pModule.source)
                )
            }
        )
    );
}

module.exports = (pModules, pOptions) => {
    if (circularityDetectionNecessary(pOptions)){
        return addCircularityCheckToGraph(pModules);
    }
    return pModules;
};
