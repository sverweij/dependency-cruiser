"use strict";

const Handlebars                       = require("handlebars/dist/cjs/handlebars.runtime");
const dependencyToIncidenceTransformer = require("./dependencyToIncidenceTransformer");

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
            dependencies: Handlebars.templates['html.template.hbs']({
                "things" : dependencyToIncidenceTransformer.transform(pInput.dependencies).map(addShowTitle)
            })
        }
    );
