const Handlebars                       = require("handlebars/runtime");
const dependencyToIncidenceTransformer = require("../dependencyToIncidenceTransformer");

// eslint-disable-next-line import/no-unassigned-import
require("./csv.template");

/**
 * Returns the results of a cruise in an 'incidence matrix'
 *
 * @param {any} pResults - the output of a dependency-cruise adhering to ../../extract/results-schema.json
 * @returns {string} - incidence matrix in csv format
 */
module.exports = pResults => Handlebars.templates['csv.template.hbs'](
    {
        "things" : dependencyToIncidenceTransformer(pResults.modules)
    }
);
