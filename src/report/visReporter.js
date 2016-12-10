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

module.exports = (pInput) => ({
    dependencies: Handlebars.templates['vis.template.hbs']({
        "things" : pInput.map(addPath)
    })
});
