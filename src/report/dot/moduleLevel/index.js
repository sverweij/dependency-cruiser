const path            = require('path').posix;
const Handlebars      = require('handlebars/runtime');
const _get            = require('lodash/get');
const coloring        = require('../common/coloring');
const folderify       = require('../common/folderify');
const compareOnSource = require("../common/compareOnSource");

// eslint-disable-next-line import/no-unassigned-import
require("./dot.template");

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

/**
 * Sort of smartly concatenate the given prefix and source:
 *
 * if it's an uri pattern (e.g. https://yadda, file://snorkel/bla)
 * simply concat.
 *
 * in all other cases path.posix.join the two
 *
 * @param {string} pPrefix - prefix
 * @param {string} pSource - filename
 * @return {string} prefix and filename concatenated
 */
function concatenateify(pPrefix, pSource) {
    if (pPrefix.match(/^[a-z]+:\/\//)) {
        return `${pPrefix}${pSource}`;
    } else {
        return path.join(pPrefix, pSource);
    }
}

function addURL(pInput) {
    const lPrefix = _get(pInput, "summary.optionsUsed.prefix", '');

    return (pModule) =>
        Object.assign(
            {},
            pModule,
            (pModule.coreModule || pModule.couldNotResolve) ? {} : {url: concatenateify(lPrefix, pModule.source)}
        );
}

/**
 * Returns the results of a cruise as a directed graph in the dot language.
 *
 * @param {any} pColoringScheme - a mapping of source properties to a color, fillcolor and fontcolor
 *                              - see ../comon/richModuleCOlorScheme.json for an example
 * @param {any} pResults - the output of a dependency-cruise adhering to ../../../extract/results-schema.json
 * @returns {string} - a dot program
 */
module.exports = (pColoringScheme) => (pResults) => Handlebars.templates['dot.template.hbs'](
    {
        "things" : pResults.modules
            .sort(compareOnSource)
            .map(extractFirstTransgression)
            .map(folderify)
            .map(colorize(pColoringScheme))
            .map(addURL(pResults))
    }
);
