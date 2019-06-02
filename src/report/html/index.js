const Handlebars                       = require("handlebars/runtime");
const dependencyToIncidenceTransformer = require("../dependencyToIncidenceTransformer");

// eslint-disable-next-line import/no-unassigned-import
require("./html.template");

function addShowTitle(pDependencyEntry) {
    return Object.assign(
        pDependencyEntry,
        {
            incidences: pDependencyEntry.incidences.map(pIncidence =>
                Object.assign(
                    pIncidence,
                    {
                        hasRelation: pIncidence.incidence !== "false"
                    }
                )
            )
        }
    );
}

/**
 * Returns the results of a cruise in an 'incidence matrix'
 *
 * @param {any} pResults - the output of a dependency-cruise adhering to ../../extract/results-schema.json
 * @returns {string} - incidence matrix in an html table with some simple bits and bobs to make
 *                     it easier to navigate.
 */
module.exports = pResults => Handlebars.templates['html.template.hbs'](
    {
        "things" : dependencyToIncidenceTransformer(pResults.modules).map(addShowTitle)
    }
);
