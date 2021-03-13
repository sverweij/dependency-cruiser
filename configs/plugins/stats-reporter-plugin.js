const MEDIAN = 0.5;
const P75 = 0.75;
const DEFAULT_JSON_INDENT = 2;

function doMagic(pCruiseResult) {
  let lReturnValue = {};

  if (pCruiseResult.modules.some((pModule) => pModule.dependents)) {
    const lDependentCounts = pCruiseResult.modules
      .map((pModule) => pModule.dependents.length)
      .sort();

    lReturnValue = {
      minDependentsPerModule: lDependentCounts[0] || 0,
      maxDependentsPerModule:
        lDependentCounts[Math.max(lDependentCounts.length - 1, 0)] || 0,
      meanDependentsPerModule:
        lDependentCounts.reduce((pAll, pCurrent) => pAll + pCurrent, 0) /
        pCruiseResult.summary.totalCruised,
      medianDependentsPerModule:
        lDependentCounts[
          Math.max(0, Math.floor(lDependentCounts.length * MEDIAN))
        ],
      p75DependentsPerModule:
        lDependentCounts[
          Math.max(0, Math.floor(lDependentCounts.length * P75))
        ],
    };
  }
  return lReturnValue;
}
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
      pCruiseResult.summary.totalDependenciesCruised /
      pCruiseResult.summary.totalCruised,
    medianDependenciesPerModule:
      lDependencyCounts[
        Math.max(0, Math.floor(lDependencyCounts.length * MEDIAN))
      ],
    p75DependenciesPerModule:
      lDependencyCounts[
        Math.max(0, Math.floor(lDependencyCounts.length * P75))
      ],
    ...doMagic(pCruiseResult),
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
