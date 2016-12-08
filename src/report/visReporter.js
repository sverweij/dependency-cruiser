"use strict";
const path       = require("path");
const Handlebars = require("handlebars/dist/cjs/handlebars.runtime");

require("./vis.template");

function addPath(pDependencyItem) {
    return Object.assign(
        pDependencyItem,
        {path: path.dirname(pDependencyItem.source)}
    );
}

function render(pInput) {
    return {
        content: Handlebars.templates['vis.template.hbs']({
            "things" : pInput.map(addPath)
        })
    };
}

module.exports = render;
