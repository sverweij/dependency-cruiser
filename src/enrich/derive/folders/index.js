const getStabilityMetrics = require("./get-stability-metrics");

function shouldDeriveFolders(pOptions) {
  return pOptions.metrics || pOptions.outputType === "metrics";
}

module.exports = function deriveFolders(pModules, pOptions) {
  if (shouldDeriveFolders(pOptions)) {
    return { folders: getStabilityMetrics(pModules) };
  }
  return {};
};
