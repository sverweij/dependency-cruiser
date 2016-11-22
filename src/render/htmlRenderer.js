"use strict";

const Handlebars                       = require("handlebars/dist/cjs/handlebars.runtime");
const dependencyToIncidenceTransformer = require("./dependencyToIncidenceTransformer");

require("./html.template");

function addShowTitle(pDependencyEntry) {
    return {
        source: pDependencyEntry.source,
        incidences: pDependencyEntry.incidences.map(pIncidence => {
            return {
                incidence: pIncidence.incidence,
                to: pIncidence.to,
                hasRelation: pIncidence.incidence !== "false"
            };
        })
    };
}

function render(pInput) {
    return Handlebars.templates['html.template.hbs']({
        "things" : dependencyToIncidenceTransformer.transform(pInput).map(addShowTitle)
    });
}

exports.render = render;

/* eslint arrow-body-style: 0 */
