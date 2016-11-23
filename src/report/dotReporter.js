"use strict";

const path       = require('path');
const Handlebars = require("handlebars/dist/cjs/handlebars.runtime");

require("./dot.template");

Handlebars.registerPartial(
    'dot.template.hbs',
    Handlebars.templates['dot.template.hbs']
);

function compareOnSource(pOne, pTwo) {
    return pOne.source > pTwo.source ? 1 : -1;
}

function folderify(pDependencyItem) {
    let lAdditions = {};
    let lDirName = path.dirname(pDependencyItem.source);

    if (lDirName !== ".") {
        lAdditions.folder = lDirName;
        lAdditions.path = lDirName.split(path.sep);
    }

    lAdditions.label = path.basename(pDependencyItem.source);

    return Object.assign(
        pDependencyItem,
        lAdditions
    );

}

function render(pInput) {
    return Handlebars.templates['dot.template.hbs']({
        "things" : pInput.sort(compareOnSource).map(folderify)
    });
}

exports.render = render;
