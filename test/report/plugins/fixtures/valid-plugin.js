function samplePluginReporter(pCruiseResult) {
  return {
    moduleCount: pCruiseResult.summary.totalCruised,
    dependencyCount: pCruiseResult.summary.totalDependenciesCruised,
  };
}

module.exports = (pCruiseResult) => ({
  output: JSON.stringify(samplePluginReporter(pCruiseResult), null, 2),
  exitCode: 0,
});
