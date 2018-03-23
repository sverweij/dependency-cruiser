"use strict";

const Handlebars                       = require("handlebars/runtime");
const dependencyToIncidenceTransformer = require("../dependencyToIncidenceTransformer");

require("./csv.template");

module.exports = pInput =>
    Object.assign(
        {},
        pInput,
        {
            dependencies: Handlebars.templates['csv.template.hbs']({
                "things" : dependencyToIncidenceTransformer(pInput.dependencies)
            })
        }
    );

/* eslint import/no-unassigned-import: 0 */
