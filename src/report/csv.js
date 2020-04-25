const dependencyToIncidenceTransformer = require("./utl/dependency-to-incidence-transformer");

function renderHeader(pModules) {
  return pModules.map((pModule) => `"${pModule.source}"`).join(",");
}

function mapIncidences(pIncidences) {
  return pIncidences.map((pIncidence) => `"${pIncidence.incidence}"`).join(",");
}

function renderBody(pModules) {
  return pModules.reduce(
    (pAll, pModule) =>
      `${pAll}\n"${pModule.source}",${mapIncidences(pModule.incidences)},""`,
    ""
  );
}

function report(pModules) {
  return `"",${renderHeader(pModules)},""${renderBody(pModules)}\n`;
}

/**
 * Returns the results of a cruise in an 'incidence matrix'
 *
 * @param {ICruiseResult} pResults - the output of a dependency-cruise adhering to ../../schema/cruise-result.schema.json
 * @returns {IReporterOutput} - output: incidence matrix in csv format
 *                     exitCode: 0
 */
module.exports = (pResults) => ({
  output: report(dependencyToIncidenceTransformer(pResults.modules)),
  exitCode: 0,
});
