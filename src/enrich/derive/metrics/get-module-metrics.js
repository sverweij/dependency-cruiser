const IndexedModuleGraph = require("../../../graph-utl/indexed-module-graph");
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
  const lIndexedModules = new IndexedModuleGraph(pAllModules);
  return (pDependency) => ({
    ...pDependency,
    instability:
      (lIndexedModules.findModuleByName(pDependency.resolved) || {})
        .instability || 0,
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
