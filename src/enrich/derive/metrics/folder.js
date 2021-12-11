const getStabilityMetrics = require("./get-stability-metrics");

module.exports = function deriveMetrics(pModules, pOptions) {
  if (pOptions.metrics) {
    return { folders: getStabilityMetrics(pModules) };
  }
  return {};
};
