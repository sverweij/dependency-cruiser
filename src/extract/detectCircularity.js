
function relationEndsUpAtFrom(pGraph, pFrom, pTo, pVisited) {
    // might be integrateable into ./index.js
    pVisited = pVisited || new Set();

    const lToNode = pGraph.filter(pNode => pNode.source === pTo)[0];

    return Boolean(lToNode) &&
        lToNode.hasOwnProperty("dependencies") &&
        lToNode.dependencies.filter(
            pToToNodeName => !pVisited.has(pToToNodeName)
        ).some(
            pToToNodeName =>
                (pToToNodeName.hasOwnProperty("resolved") && pToToNodeName.resolved === pFrom)
                ? true
                : relationEndsUpAtFrom(
                    pGraph,
                    pFrom,
                    pToToNodeName.resolved,
                    pVisited.add(pToToNodeName)
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
