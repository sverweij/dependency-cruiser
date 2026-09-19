/**
 * Returns the results of a cruise _only_ in an exitCode
 *
 * @param {import("../../types/cruise-result.mjs").ICruiseResult} pResults
 * @returns {import("../../types/dependency-cruiser.mjs").IReporterOutput}
 */
export default function nullReporter(pResults) {
  return {
    output: "",
    // advisedExitCode is a mandatory attribute as of dependency-cruiser 18.4.0
    // however, this reporter can still encounter dependency-cruiser results
    // from before that, hence the fallback
    exitCode: pResults.summary.advisedExitCode ?? pResults.summary.error,
  };
}
