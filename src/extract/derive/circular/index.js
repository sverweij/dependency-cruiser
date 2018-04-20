const dependencyEndsUpAtFrom = require('./dependencyEndsUpAtFrom');

function circularityDetectionNecessary(pOptions) {
    if (pOptions.forceCircular) {
        return true;
    }
    if (pOptions.validate && pOptions.ruleSet) {
        return pOptions.ruleSet.forbidden &&
            pOptions.ruleSet.forbidden.some(
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
 * @param  {Object} pDependencies [description]
 * @return {Object}               the same dependencies, but for each
 *                                of them added whether or not it is
 *                                part of
 */
function addCircularityCheckToGraph (pDependencies) {
    return pDependencies.map(
        pNode => Object.assign(
            {},
            pNode,
            {
                dependencies: pNode.dependencies.map(
                    pToDep => addCircularityCheckToDependency(pToDep, pDependencies, pNode.source)
                )
            }
        )
    );
}

module.exports = (pDependencies, pOptions) => {
    if (circularityDetectionNecessary(pOptions)){
        return addCircularityCheckToGraph(pDependencies);
    }
    return pDependencies;
};
