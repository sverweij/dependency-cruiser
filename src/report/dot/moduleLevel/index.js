const path = require("path").posix;
const Handlebars = require("handlebars/runtime");
const _get = require("lodash/get");
const coloring = require("../common/coloring");
const folderify = require("../common/folderify");
const compareOnSource = require("../common/compareOnSource");

// eslint-disable-next-line import/no-unassigned-import
require("./dot.template");

function colorize(pColoringScheme) {
  return pModule => ({
    ...pModule,
    dependencies: pModule.dependencies.map(coloring.determineDependencyColor),
    ...coloring.determineModuleColors(pModule, pColoringScheme)
  });
}

function extractFirstTransgression(pModule) {
  return {
    ...(pModule.rules ? { ...pModule, rule: pModule.rules[0] } : pModule),
    dependencies: pModule.dependencies.map(pDependency =>
      pDependency.rules
        ? {
            ...pDependency,
            rule: pDependency.rules[0]
          }
        : pDependency
    )
  };
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
  const lPrefix = _get(pInput, "summary.optionsUsed.prefix", "");

  return pModule =>
    Object.assign(
      {},
      pModule,
      pModule.coreModule || pModule.couldNotResolve
        ? {}
        : { url: concatenateify(lPrefix, pModule.source) }
    );
}

function report(pResults, pColoringScheme) {
  return Handlebars.templates["dot.template.hbs"]({
    things: pResults.modules
      .sort(compareOnSource)
      .map(extractFirstTransgression)
      .map(folderify)
      .map(colorize(pColoringScheme))
      .map(addURL(pResults))
  });
}

/**
 * Returns the results of a cruise as a directed graph in the dot language.
 *
 * @param {any} pResults - the output of a dependency-cruise adhering to ../../../extract/results-schema.json
 * @param {any} pColoringScheme - a mapping of source properties to a color, fillcolor and fontcolor
 *                              - see ../comon/richModuleCOlorScheme.json for an example
 * @returns {object} - output: a dot program
 *                     exitCode: 0
 */
module.exports = (pResults, pColoringScheme) => ({
  output: report(pResults, pColoringScheme),
  exitCode: 0
});
