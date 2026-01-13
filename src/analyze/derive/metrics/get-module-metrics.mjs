import { calculateInstability, metricsAreCalculable } from "../module-utl.mjs";

export function addInstabilityMetric(pModule) {
  return {
    ...pModule,
    ...(metricsAreCalculable(pModule)
      ? {
          instability: calculateInstability(
            pModule.dependencies.length,
            pModule.dependents.length,
          ),
        }
      : {}),
  };
}

function addInstabilityToDependency(pIndexedModules) {
  return (pDependency) => ({
    ...pDependency,
    instability:
      (pIndexedModules.findVertexByName(pDependency.resolved) || {})
        .instability || 0,
  });
}

export function deNormalizeInstabilityMetricsToDependencies(
  pModule,
  pIndexedModules,
) {
  return {
    ...pModule,
    dependencies: pModule.dependencies.map(
      addInstabilityToDependency(pIndexedModules),
    ),
  };
}
