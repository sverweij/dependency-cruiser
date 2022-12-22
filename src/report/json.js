/**
 * Returns the results of a cruise in JSON
 *
 * @param {import("../../types/cruise-result").ICruiseResult} pResults
 * @returns {import("../../types/dependency-cruiser").IReporterOutput}
 */
module.exports = function json(pResults) {
  return {
    output: JSON.stringify(pResults, null, "  "),
    exitCode: 0,
  };
};
