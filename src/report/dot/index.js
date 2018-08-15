"use strict";
const path       = require('path').posix;
const Handlebars = require("handlebars/runtime");
const coloring   = require('./coloring');

require("./dot.template");

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

function colorize(pColoringScheme) {
    return pModule => Object.assign(
        {},
        pModule,
        {
            dependencies: pModule.dependencies.map(coloring.determineDependencyColor)
        },
        coloring.determineModuleColors(pModule, pColoringScheme)
    );
}

function extractFirstTransgression(pModule){
    return Object.assign(
        {},
        (pModule.rules ? Object.assign({}, pModule, {rule: pModule.rules[0]}) : pModule),
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

module.exports = (pColoringScheme) => (pInput) =>
    Object.assign(
        {},
        pInput,
        {
            modules: Handlebars.templates['dot.template.hbs']({
                "things" : pInput.modules
                    .sort(compareOnSource)
                    .map(extractFirstTransgression)
                    .map(folderify)
                    .map(colorize(pColoringScheme))
                    .map(addURL(pInput))
            })
        }
    );

/* eslint import/no-unassigned-import: 0 */
