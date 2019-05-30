const Handlebars                       = require("handlebars/runtime");
const dependencyToIncidenceTransformer = require("../dependencyToIncidenceTransformer");

require("./csv.template");

module.exports = pInput => Handlebars.templates['csv.template.hbs'](
    {
        "things" : dependencyToIncidenceTransformer(pInput.modules)
    }
);

/* eslint import/no-unassigned-import: 0 */
