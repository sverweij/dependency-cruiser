const path = require("path").posix;

function getAfferentCouplings(pModule, pDirname) {
  return pModule.dependents.filter(
    (pDependent) => !pDependent.startsWith(pDirname.concat(path.sep))
  );
}

function getEfferentCouplings(pModule, pDirname) {
  return pModule.dependencies.filter(
    (pDependency) => !pDependency.resolved.startsWith(pDirname.concat(path.sep))
  );
}

function metricsAreCalculable(pModule) {
  return (
    !pModule.coreModule &&
    !pModule.couldNotResolve &&
    !pModule.matchesDoNotFollow
  );
}

module.exports = {
  getAfferentCouplings,
  getEfferentCouplings,
  metricsAreCalculable,
};
