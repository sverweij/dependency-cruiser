/**
 * Returns true if the graph behind pTo contains pFrom.
 * Returns false in all other cases
 *
 * @param  {object} pGraph   The graph in which to test this condition
 * @param  {string} pFrom    The 'source' attribute of the node to be tested
 *                           (source uniquely identifying a node)
 * @param  {string} pTo      The 'source' attribute of the 'to' node to
 *                           be traversed
 * @param  {Set} pVisited    The set of nodes visited hithereto (optional
 *                           attribute - there's no need to pass it when
 *                           calling it; it's used by the algorithm to
 *                           determine the stop condition)
 * @return {boolean}        see description above
 */
function dependencyEndsUpAtFrom(pGraph, pFrom, pTo, pVisited) {
    pVisited = pVisited || new Set();

    const lToNode = pGraph.find(pNode => pNode.source === pTo);

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
                : dependencyEndsUpAtFrom(
                    pGraph,
                    pFrom,
                    pToToNode.resolved,
                    pVisited.add(pToToNode.resolved)
                )
    );
}

module.exports = dependencyEndsUpAtFrom;
