const EOL = "\n";
/**
 * Returns the results of a cruise in JSON
 *
 * @param {import("../../types/cruise-result").ICruiseResult} pResults
 * @returns {import("../../types/dependency-cruiser").IReporterOutput}
 */
export default function json(pResults) {
  return {
    output: JSON.stringify(pResults, null, "  ") + EOL,
    exitCode: 0,
  };
}
