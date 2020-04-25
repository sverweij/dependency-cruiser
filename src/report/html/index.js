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

/**
 * Returns the results of a cruise in an 'incidence matrix'
 *
 * @param {ICruiseResult} pResults - the output of a dependency-cruise adhering to ../../schema/cruise-result.schema.json
 * @returns {IReporterOutput} - .output: incidence matrix in an html table with some simple bits and bobs to make
 *                                       it easier to navigate.
 *                              .exitCode: 0
 */
function report(pResults) {
  return Handlebars.templates["html.template.hbs"]({
    modules: dependencyToIncidenceTransformer(pResults.modules).map(
      addShowTitle
    ),
  });
}

module.exports = (pResults) => ({
  output: report(pResults),
  exitCode: 0,
});
