"use strict";

const Handlebars                       = require("handlebars/dist/cjs/handlebars.runtime");
const dependencyToIncidenceTransformer = require("./dependencyToIncidenceTransformer");

require("./csv.template");

module.exports = pInput =>
    Object.assign(
        {},
        pInput,
        {
            dependencies: Handlebars.templates['csv.template.hbs']({
                "things" : dependencyToIncidenceTransformer.transform(pInput.dependencies)
            })
        }
    );
