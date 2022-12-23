/**
 * Returns the results of a cruise in JSON
 *
 * @param {import("../../types/cruise-result").ICruiseResult} pResults
 * @returns {import("../..").IReporterOutput}
 */
module.exports = function json(pResults) {
  return {
    output: JSON.stringify(pResults, null, "  "),
    exitCode: 0,
  };
};
