"use strict";

const path       = require('path').posix;
const Handlebars = require("handlebars/runtime");

require("./dot.template");

const SEVERITY2COLOR = {
    error : "red",
    warn  : "orange",
    info  : "blue"
};
const DEFAULT_VIOLATION_COLOR = "red";

function compareOnSource(pModuleOne, pModuleTwo) {
    return pModuleOne.source > pModuleTwo.source ? 1 : -1;
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

function folderify(pModule) {
    let lAdditions = {};
    let lDirName = path.dirname(pModule.source);

    if (lDirName !== ".") {
        lAdditions.folder = lDirName;
        lAdditions.path   = lDirName.split(path.sep).map(aggregate);
    }

    lAdditions.label = path.basename(pModule.source);

    return Object.assign(
        {},
        pModule,
        lAdditions
    );
}

function determineDependencyColor(pDependency) {
    let lColorAddition = {};

    if (pDependency.hasOwnProperty("valid") && !pDependency.valid) {
        lColorAddition.color = SEVERITY2COLOR[pDependency.rule.severity] || DEFAULT_VIOLATION_COLOR;
    }

    return Object.assign(
        {},
        pDependency,
        lColorAddition
    );
}
/* eslint security/detect-object-injection: 0 */
function determineModuleColor(pModule) {
    const MODULE2COLOR = {
        "couldNotResolve": "red",
        "coreModule": "grey",
        "orphan": "#008800"
    };

    return MODULE2COLOR[
        Object.keys(MODULE2COLOR).find(
            (pKey) => pModule[pKey]
        )
    ] || null;
}

function colorize(pModule){
    return Object.assign(
        {},
        pModule,
        {
            color: determineModuleColor(pModule),
            dependencies: pModule.dependencies.map(determineDependencyColor)
        }
    );
}

function extractFirstTransgression(pModule){
    return Object.assign(
        {},
        pModule,
        {
            dependencies: pModule.dependencies.map(
                pDependency =>
                    pDependency.rules
                        ? Object.assign(
                            {},
                            pDependency,
                            {
                                rule: pDependency.rules[0]
                            }
                        )
                        : pDependency
            )
        }
    );
}

function addURL(pInput) {
    const lPrefix = pInput.summary.optionsUsed ? pInput.summary.optionsUsed.prefix || "" : "";

    return (pModule) =>
        Object.assign(
            {},
            pModule,
            (pModule.coreModule || pModule.couldNotResolve) ? {} : {url: `${path.join(lPrefix, pModule.source)}`}
        );
}

module.exports = (pInput) =>
    Object.assign(
        {},
        pInput,
        {
            dependencies: Handlebars.templates['dot.template.hbs']({
                "things" : pInput.dependencies
                    .sort(compareOnSource)
                    .map(extractFirstTransgression)
                    .map(folderify)
                    .map(colorize)
                    .map(addURL(pInput))
            })
        }
    );

/* eslint import/no-unassigned-import: 0 */
