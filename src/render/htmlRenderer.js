const Handlebars                       = require("handlebars/dist/cjs/handlebars.runtime");
const dependencyToIncidenceTransformer = require("./dependencyToIncidenceTransformer");

require("./html.template");

function render(pInput) {
    return Handlebars.templates['html.template.hbs']({
        "things" : dependencyToIncidenceTransformer.transform(pInput)
    });
}

exports.render = render;
