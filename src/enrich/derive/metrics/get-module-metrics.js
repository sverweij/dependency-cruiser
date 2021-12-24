const { findModuleByName } = require("../module-utl");
const { calculateInstability, metricsAreCalculable } = require("../module-utl");

function addInstabilityMetric(pModule) {
  return {
    ...pModule,
    ...(metricsAreCalculable(pModule)
      ? {
          instability: calculateInstability(
            pModule.dependencies.length,
            pModule.dependents.length
          ),
        }
      : {}),
  };
}

function addInstabilityToDependency(pAllModules) {
  return (pDependency) => ({
    ...pDependency,
    instability:
      (findModuleByName(pAllModules, pDependency.resolved) || {}).instability ||
      0,
  });
}

function deNormalizeInstabilityMetricsToDependencies(pModule, _, pAllModules) {
  return {
    ...pModule,
    dependencies: pModule.dependencies.map(
      addInstabilityToDependency(pAllModules)
    ),
  };
}

module.exports = {
  addInstabilityMetric,
  deNormalizeInstabilityMetricsToDependencies,
};
