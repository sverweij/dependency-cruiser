const { clearCache } = require("../module-utl");
const {
  addInstabilityMetric,
  deNormalizeInstabilityMetricsToDependencies,
} = require("./get-module-metrics");

module.exports = function deriveModulesMetrics(pModules, pOptions) {
  if (pOptions.metrics) {
    const lModules = pModules.map(addInstabilityMetric);
    clearCache();
    return lModules.map(deNormalizeInstabilityMetricsToDependencies);
  }
  return pModules;
};
