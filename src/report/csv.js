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
 * @param {import("../../types/cruise-result").ICruiseResult} pResults -
 * the output of a dependency-cruise adhering to ../../schema/cruise-result.schema.json
 * @returns {import("../..").IReporterOutput}
 */
module.exports = function csv(pResults) {
  return {
    output: report(dependencyToIncidenceTransformer(pResults.modules)),
    exitCode: 0,
  };
};
