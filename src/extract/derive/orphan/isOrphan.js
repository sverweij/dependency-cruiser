function hasDependency(pResolvedName) {
    return (pNode) =>
        pNode.dependencies.some(pToDependency => pToDependency.resolved === pResolvedName);
}

module.exports = (pNode, pGraph) => {
    if (pNode.dependencies.length > 0){
        return false;
    }

    return !pGraph.some(hasDependency(pNode.source));
};
