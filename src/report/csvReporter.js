"use strict";

const Handlebars                       = require("handlebars/dist/cjs/handlebars.runtime");
const dependencyToIncidenceTransformer = require("./dependencyToIncidenceTransformer");

require("./csv.template");

function render(pInput) {
    return Handlebars.templates['csv.template.hbs']({
        "things" : dependencyToIncidenceTransformer.transform(pInput)
    });
}

module.exports = render;
