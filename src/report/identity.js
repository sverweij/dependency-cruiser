/**
 * Returns the results of a cruise in a javascript object
 *
 * @param {import("../../types/cruise-result").ICruiseResult} pResults
 * @returns {import("../../types/dependency-cruiser").IReporterOutput}
 */
module.exports = (pResults) => ({
  output: pResults,
  exitCode: 0,
});
