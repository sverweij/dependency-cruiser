/**
 * Returns the results of a cruise in JSON
 *
 * @param {import("../../types/cruise-result").ICruiseResult} pResults
 * @returns {import("../../types/dependency-cruiser").IReporterOutput}
 */
module.exports = function nullReporter(pResults) {
  return {
    output: "",
    exitCode: pResults.summary.error,
  };
};
