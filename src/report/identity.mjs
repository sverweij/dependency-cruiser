/**
 * Returns the results of a cruise in a javascript object
 *
 * @param {import("../../types/cruise-result").ICruiseResult} pResults
 * @returns {import("../../types/dependency-cruiser").IReporterOutput}
 */
export default function identity(pResults) {
  return {
    output: pResults,
    exitCode: 0,
  };
}
