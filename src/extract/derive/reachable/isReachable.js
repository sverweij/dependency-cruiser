const _memoize = require('lodash/memoize');

/**
 * Returns true if, in the graph pGraph, pTo is a (transient) dependency of pFrom,
 * returns false in all other cases
 *
 * @param {any} pGraph - dependency graph
 * @param {string} pFrom -resolved name of the 'from' module
 * @param {string} pTo - resolved name of the 'to' module
 * @param {Set} pVisited - set of visited modules
 * @returns {boolean} - the result
 */
function isReachable(pGraph, pFrom, pTo, pVisited = new Set()) {
    let lRetval = false;
    const lNode = pGraph.find(pNode => pNode.source === pFrom);

    pVisited.add(pFrom);

    if (lNode) {
        const lDirectUnvisitedDependencies = lNode.dependencies
            .filter(pDependency => !pVisited.has(pDependency.resolved))
            .map(pDependency => pDependency.resolved);

        if (pFrom === pTo || lDirectUnvisitedDependencies.some(pDirectDependency => pDirectDependency === pTo)) {
            lRetval = true;
        } else {
            lRetval = lDirectUnvisitedDependencies
                .some(
                    // eslint-disable-next-line no-use-before-define
                    pDirectDependency => isReachableMemoized(pGraph, pDirectDependency, pTo, pVisited)
                );
        }
    }

    return lRetval;
}

const isReachableMemoized = _memoize(isReachable, (_pGraph, pFrom, pTo) => `${pFrom}|${pTo}`);

module.exports = isReachableMemoized;
module.exports.clearCache = () => isReachableMemoized.cache.clear();
