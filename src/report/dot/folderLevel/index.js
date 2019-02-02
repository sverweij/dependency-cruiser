const path            = require('path').posix;
const Handlebars      = require("handlebars/runtime");
const _clone          = require('lodash/clone');
const _get            = require('lodash/get');
const _uniqBy         = require('lodash/uniqBy');
const coloring        = require('../common/coloring');
const folderify       = require('../common/folderify');
const compareOnSource = require("../common/compareOnSource");

require("./ddot.template");

function colorize(pModule) {
    return Object.assign(
        {},
        pModule,
        {
            dependencies: pModule.dependencies.map(coloring.determineDependencyColor)
        }
    );
}
function extractRelevantTransgressions(pModule){
    return Object.assign(
        {},
        (pModule.rules ? Object.assign({}, pModule, {rule: pModule.rules[0]}) : pModule),
        {
            dependencies: pModule.dependencies.map(
                pDependency =>
                    Object.assign(
                        {},
                        pDependency,
                        {
                            rule: pDependency.rules[0]
                        }
                    )
            )
        }
    );
}

function shortendep (pDep) {
    return Object.assign(
        {},
        pDep,
        {
            resolved: path.dirname(pDep.resolved)
        }
    );
}

function squashToDir (pModules) {
    return pModules
        .map(pModule =>
            Object.assign(
                {},
                pModule,
                {
                    source: path.dirname(pModule.source),
                    dependencies: pModule.dependencies.map(shortendep)
                }
            )
        );
}

function mergeModule(pLeft, pRight) {
    return Object.assign(
        {},
        pLeft,
        pRight,
        {
            dependencies: pLeft
                .dependencies
                .concat(pRight.dependencies),
            valid: pLeft.valid && pRight.valid
        }
    );
}

function mergeModules(pSourceString, pModules){
    return pModules
        .filter(
            pModule => pModule.source === pSourceString
        )
        .reduce(
            (pAll, pCurrentModule) => mergeModule(pAll, pCurrentModule),
            {
                dependencies: [],
                valid: true
            }
        );
}

function mergeDependency(pLeft, pRight) {
    return Object.assign(
        {},
        pLeft,
        pRight,
        {
            dependendencyTypes: _uniqBy(pLeft.dependendencyTypes.concat(pRight.dependendencyTypes)),
            rules: pLeft.rules.concat(_get(pRight, 'rules', [])),
            valid: pLeft.valid && pRight.valid
        }
    );
}

function mergeDependencies(pResolvedName, pDependencies){
    return pDependencies
        .filter(
            pDependency => pDependency.resolved === pResolvedName
        )
        .reduce(
            (pAll, pCurrentDependency) => mergeDependency(pAll, pCurrentDependency),
            {
                dependendencyTypes: [],
                rules: [],
                valid: true
            }
        );
}

function consolidateDependencies(pDependencies) {
    let lDependencies = _clone(pDependencies);
    let lRetval = [];
    const notThisDependency = (pResolvedName) => (pDependency) => pDependency.resolved !== pResolvedName;

    while (lDependencies.length > 0){
        lRetval.push(mergeDependencies(lDependencies[0].resolved, lDependencies));
        lDependencies = lDependencies.filter(notThisDependency(lDependencies[0].resolved));
    }

    return lRetval;
}

function consolidateModules(pModules){
    let lModules = _clone(pModules);
    let lRetval = [];
    const notThisSource = (pSourceString) => (pModule) => pModule.source !== pSourceString;

    while (lModules.length > 0){
        lRetval.push(mergeModules(lModules[0].source, lModules));
        lModules = lModules.filter(notThisSource(lModules[0].source));
    }
    return lRetval
        .map(
            pModule => Object.assign({}, pModule, {dependencies: consolidateDependencies(pModule.dependencies)})
        );
}

module.exports = (pInput) =>
    Object.assign(
        {},
        pInput,
        {
            modules: Handlebars.templates['ddot.template.hbs']({
                "things" : consolidateModules(squashToDir(pInput.modules))
                    .sort(compareOnSource)
                    .map(extractRelevantTransgressions)
                    .map(folderify)
                    .map(colorize)
            })
        }
    );

/* eslint import/no-unassigned-import: 0 */
