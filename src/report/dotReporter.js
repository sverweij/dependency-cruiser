"use strict";

const path       = require('path');
const Handlebars = require("handlebars/dist/cjs/handlebars.runtime");

require("./dot.template");

const SEVERITY2COLOR = {
    error       : "red",
    warn     : "orange",
    info : "blue"
};
const DEFAULT_VIOLATION_COLOR = "red";

function compareOnSource(pOne, pTwo) {
    return pOne.source > pTwo.source ? 1 : -1;
}

function toFullPath (pAll, pCurrent) {
    return `${pAll}${path.sep}${pCurrent}`;
}

function aggregate (pPathSnippet, pCounter, pPathArray){
    return {
        snippet: pPathSnippet,
        aggregateSnippet: `${pPathArray.slice(0, pCounter).reduce(toFullPath, '')}${path.sep}${pPathSnippet}`
    };
}

function folderify(pDependencyItem) {
    let lAdditions = {};
    let lDirName = path.dirname(pDependencyItem.source);

    if (lDirName !== ".") {
        lAdditions.folder = lDirName;
        lAdditions.path   = lDirName.split(path.sep).map(aggregate);
    }

    lAdditions.label = path.basename(pDependencyItem.source);

    return Object.assign(
        pDependencyItem,
        lAdditions
    );
}

function determineColor(pDependency) {
    let lColorAddition = {};

    if (pDependency.hasOwnProperty("valid") && !pDependency.valid) {
        lColorAddition.color = SEVERITY2COLOR[pDependency.rule.severity] || DEFAULT_VIOLATION_COLOR;
    }

    return Object.assign(
        pDependency,
        lColorAddition
    );
}

function colorize(pDependencyItem){
    return Object.assign(
        pDependencyItem,
        {
            dependencies: pDependencyItem.dependencies.map(determineColor)
        }
    );
}

function render(pInput) {
    return Handlebars.templates['dot.template.hbs']({
        "things" : pInput.sort(compareOnSource).map(folderify).map(colorize)
    });
}

module.exports = render;
