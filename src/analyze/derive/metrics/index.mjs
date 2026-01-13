import {
  addInstabilityMetric,
  deNormalizeInstabilityMetricsToDependencies,
} from "./get-module-metrics.mjs";
import IndexedModuleGraph from "#graph-utl/indexed-module-graph.mjs";

export default function deriveModulesMetrics(pModules, pOptions) {
  if (pOptions.metrics) {
    const lModules = pModules.map(addInstabilityMetric);
    const lIndexedModules = new IndexedModuleGraph(lModules);

    return lModules.map((pModule) =>
      deNormalizeInstabilityMetricsToDependencies(pModule, lIndexedModules),
    );
  }
  return pModules;
}
