
function relationEndsUpAtFrom(pGraph, pFrom, pTo, pVisited) {
    // might be integrateable into ./index.js
    pVisited = pVisited || new Set();

    const lToNode = pGraph.filter(pNode => pNode.source === pTo)[0];

    /* about the absence of checks whether attributes/ objects actually
     * exist:
     * - it saves CPU cycles to the effect of being ~30% faster than with the
     *   checks
     * - lToNode: is guaranteed to be there by the extract/ complete in index.js
     * - lToNode.dependencies is a mandatory attribute (as per json schema)
     * - pToToNode.resolved is a mandatory attribute (as per json schema)
     */
    return lToNode.dependencies.filter(
            pToToNode => !pVisited.has(pToToNode.resolved)
        ).some(
            pToToNode =>
                pToToNode.resolved === pFrom
                ? true
                : relationEndsUpAtFrom(
                    pGraph,
                    pFrom,
                    pToToNode.resolved,
                    pVisited.add(pToToNode.resolved)
                )
        );
}

function addCircularity (pToDep, pGraph, pFrom) {
    return Object.assign(
        {},
        pToDep,
        {
            circular: relationEndsUpAtFrom(pGraph, pFrom, pToDep.resolved)
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
module.exports = pDependencies => pDependencies.map(
    pNode => Object.assign(
        {},
        pNode,
        {
            dependencies: pNode.dependencies.map(
                pToDep => addCircularity(pToDep, pDependencies, pNode.source)
            )
        }
    )
);
