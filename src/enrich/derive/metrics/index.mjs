import {
  addInstabilityMetric,
  deNormalizeInstabilityMetricsToDependencies,
} from "./get-module-metrics.mjs";

export default function deriveModulesMetrics(pModules, pOptions) {
  if (pOptions.metrics) {
    return pModules
      .map(addInstabilityMetric)
      .map(deNormalizeInstabilityMetricsToDependencies);
  }
  return pModules;
}
