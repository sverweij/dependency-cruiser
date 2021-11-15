const getStabilityMetrics = require("./get-stability-metrics");
const { shouldDeriveMetrics } = require("./utl");

module.exports = function deriveMetrics(pModules, pOptions) {
  if (shouldDeriveMetrics(pOptions)) {
    return { folders: getStabilityMetrics(pModules) };
  }
  return {};
};
