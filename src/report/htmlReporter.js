"use strict";

const Handlebars                       = require("handlebars/dist/cjs/handlebars.runtime");
const dependencyToIncidenceTransformer = require("./dependencyToIncidenceTransformer");

require("./html.template");

function addShowTitle(pDependencyEntry) {
    return Object.assign(
        pDependencyEntry,
        {
            incidences: pDependencyEntry.incidences.map(pIncidence => {
                return Object.assign(
                    pIncidence,
                    {
                        hasRelation: pIncidence.incidence !== "false"
                    }
                );
            })
        }
    );
}

function render(pInput) {
    return Handlebars.templates['html.template.hbs']({
        "things" : dependencyToIncidenceTransformer.transform(pInput).map(addShowTitle)
    });
}

module.exports = render;

/* eslint arrow-body-style: 0 */
