"use strict";

const path       = require('path');
const Handlebars = require("handlebars/dist/cjs/handlebars.runtime");

require("./dot.template");

function compareOnSource(pOne, pTwo) {
    return pOne.source > pTwo.source ? 1 : -1;
}

let toFullPath = (pAll, pCurrent) => `${pAll}${path.sep}${pCurrent}`;

function agg (pFolder, i, ary){
    return {
        dir: pFolder,
        aggregateDir: `${ary.slice(0, i).reduce(toFullPath, '')}${path.sep}${pFolder}`
    };
}

function folderify(pDependencyItem) {
    let lAdditions = {};
    let lDirName = path.dirname(pDependencyItem.source);

    if (lDirName !== ".") {
        lAdditions.folder = lDirName;
        lAdditions.path = lDirName.split(path.sep).map(agg);
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
