const Handlebars                       = require("handlebars/runtime");
const dependencyToIncidenceTransformer = require("../dependencyToIncidenceTransformer");

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

module.exports = pInput =>
    Object.assign(
        {},
        pInput,
        {
            modules: Handlebars.templates['html.template.hbs']({
                "things" : dependencyToIncidenceTransformer(pInput.modules).map(addShowTitle)
            })
        }
    );


/* eslint import/no-unassigned-import: 0 */
