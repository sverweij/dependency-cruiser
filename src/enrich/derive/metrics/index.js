const {
  addInstabilityMetric,
  deNormalizeInstabilityMetricsToDependencies,
} = require("./get-module-metrics");

module.exports = function deriveModulesMetrics(pModules, pOptions) {
  if (pOptions.metrics) {
    return pModules
      .map(addInstabilityMetric)
      .map(deNormalizeInstabilityMetricsToDependencies);
  }
  return pModules;
};
