/**
 *
 * @param {import('../../../../types/dependency-cruiser').ICruiseResult} pCruiseResult
 * @return {string}
 */
function samplePluginReporter(pCruiseResult) {
  return {
    moduleCount: pCruiseResult.summary.totalCruised,
    dependencyCount: pCruiseResult.summary.totalDependenciesCruised,
  };
}

/**
 * Sample plugin
 *
 * @param {ICruiseResult} pCruiseResult - the output of a dependency-cruise adhering to dependency-cruiser's cruise result schema
 * @returns {IReporterOutput} - output: incidence matrix in csv format
 *                     exitCode: 0
 */
module.exports = (pCruiseResult) => ({
  output: JSON.stringify(samplePluginReporter(pCruiseResult), null, 2),
  exitCode: 0,
});
