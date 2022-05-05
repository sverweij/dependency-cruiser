const Handlebars = require("handlebars/runtime");
const dependencyToIncidenceTransformer = require("../utl/dependency-to-incidence-transformer");

// eslint-disable-next-line import/no-unassigned-import
require("./html.template");

function addShowTitle(pDependencyEntry) {
  return {
    ...pDependencyEntry,
    incidences: pDependencyEntry.incidences.map((pIncidence) => ({
      ...pIncidence,
      hasRelation: pIncidence.incidence !== "false",
    })),
  };
}

function report(pResults) {
  return Handlebars.templates["html.template.hbs"]({
    modules: dependencyToIncidenceTransformer(pResults.modules).map(
      addShowTitle
    ),
  });
}

/**
 * Returns the results of a cruise in an 'incidence matrix'
 *
 * @param {import("../../../types/cruise-result").ICruiseResult} pResults
 * @returns {import("../../../types/dependency-cruiser").IReporterOutput}
 */
module.exports = (pResults) => ({
  output: report(pResults),
  exitCode: 0,
});
