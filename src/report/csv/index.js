const Handlebars = require("handlebars/runtime");
const dependencyToIncidenceTransformer = require("../utl/dependency-to-incidence-transformer");

// eslint-disable-next-line import/no-unassigned-import
require("./csv.template");

/**
 * Returns the results of a cruise in an 'incidence matrix'
 *
 * @param {ICruiseResult} pResults - the output of a dependency-cruise adhering to ../../schema/cruise-result.schema.json
 * @returns {IReporterOutput} - output: incidence matrix in csv format
 *                     exitCode: 0
 */
module.exports = pResults => ({
  output: Handlebars.templates["csv.template.hbs"]({
    modules: dependencyToIncidenceTransformer(pResults.modules)
  }),
  exitCode: 0
});
