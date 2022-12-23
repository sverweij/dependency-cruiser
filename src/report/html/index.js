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
 * @returns {import("../../..").IReporterOutput}
 */
module.exports = function html(pResults) {
  return {
    output: report(pResults),
    exitCode: 0,
  };
};
