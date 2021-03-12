// TODO: duplicate of the function of the same nature in is-orphan
function isDependent(pResolvedName) {
  return (pModule) =>
    pModule.dependencies.some(
      (pDependency) => pDependency.resolved === pResolvedName
    );
}
module.exports = function getDependents(pModule, pModules) {
  // TODO: perf - O(n^2)
  return pModules
    .filter(isDependent(pModule.source))
    .map((pDependantModule) => pDependantModule.source);
};
