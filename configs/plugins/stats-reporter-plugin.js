const MEDIAN = 0.5;
const P75 = 0.75;
const DEFAULT_JSON_INDENT = 2;

/**
 * returns an object with some stats from the ICruiseResult pCruiseResult it
 * got passed
 *
 * @param {import('../../types/dependency-cruiser').ICruiseResult} pCruiseResult - a result from a cruise.
 * @return {string} an object with some stats
 */
function samplePluginReporter(pCruiseResult) {
  const lDependencyCounts = pCruiseResult.modules
    .map((pModule) => pModule.dependencies.length)
    .sort();

  return {
    moduleCount: pCruiseResult.summary.totalCruised,
    dependencyCount: pCruiseResult.summary.totalDependenciesCruised,
    minDependenciesPerModule: lDependencyCounts[0] || 0,
    maxDependenciesPerModule:
      lDependencyCounts[Math.max(lDependencyCounts.length - 1, 0)] || 0,
    meanDependenciesPerModule:
      pCruiseResult.summary.totalCruised /
      pCruiseResult.summary.totalDependenciesCruised,
    medianDependenciesPerModule:
      lDependencyCounts[
        Math.max(0, Math.floor(lDependencyCounts.length * MEDIAN))
      ],
    p75DependenciesPerModule:
      lDependencyCounts[
        Math.max(0, Math.floor(lDependencyCounts.length * P75))
      ],
  };
}

/**
 * Sample plugin
 *
 * @param {import('../../types/dependency-cruiser').ICruiseResult} pCruiseResult -
 *      the output of a dependency-cruise adhering to dependency-cruiser's
 *      cruise result schema
 * @return {import('../../types/dependency-cruiser').IReporterOutput} -
 *      output: some stats on modules and dependencies in json format
 *      exitCode: 0
 */
module.exports = (pCruiseResult) => ({
  output: JSON.stringify(
    samplePluginReporter(pCruiseResult),
    null,
    DEFAULT_JSON_INDENT
  ),
  exitCode: 0,
});
