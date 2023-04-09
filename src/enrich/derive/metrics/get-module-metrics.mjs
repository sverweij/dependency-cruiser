/* eslint-disable import/exports-last */
import IndexedModuleGraph from "../../../graph-utl/indexed-module-graph.mjs";
import { calculateInstability, metricsAreCalculable } from "../module-utl.mjs";

export function addInstabilityMetric(pModule) {
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

export function deNormalizeInstabilityMetricsToDependencies(
  pModule,
  _,
  pAllModules
) {
  return {
    ...pModule,
    dependencies: pModule.dependencies.map(
      addInstabilityToDependency(pAllModules)
    ),
  };
}
