const path = require("path").posix;
const Handlebars = require("handlebars/runtime");
const coloring = require("../common/coloring");
const folderify = require("../common/folderify");
const compareOnSource = require("../common/compareOnSource");
const consolidateModules = require("./consolidateModules");
const consolidateModuleDependencies = require("./consolidateModuleDependencies");

// eslint-disable-next-line import/no-unassigned-import
require("./ddot.template");

function colorize(pModule) {
  return {
    ...pModule,
    dependencies: pModule.dependencies.map(coloring.determineDependencyColor)
  };
}
function extractRelevantTransgressions(pModule) {
  return {
    ...(pModule.rules ? { ...pModule, rule: pModule.rules[0] } : pModule),
    dependencies: pModule.dependencies.map(pDependency => ({
      ...pDependency,
      rule: pDependency.rules[0]
    }))
  };
}

function shortendep(pDep) {
  return {
    ...pDep,
    resolved: path.dirname(pDep.resolved)
  };
}

function squashToDir(pModules) {
  return pModules.map(pModule => ({
    ...pModule,
    source: path.dirname(pModule.source),
    dependencies: pModule.dependencies.map(shortendep)
  }));
}

function report(pResults) {
  return Handlebars.templates["ddot.template.hbs"]({
    things: consolidateModules(squashToDir(pResults.modules))
      .map(consolidateModuleDependencies)
      .sort(compareOnSource)
      .map(extractRelevantTransgressions)
      .map(folderify)
      .map(colorize)
  });
}

/**
 * Returns the results of a cruise as a directed graph in the dot language. The dependencies
 * are collapsed to folder level, though
 *
 * @param {any} pResults - the output of a dependency-cruise adhering to ../../../extract/results-schema.json
 * @returns {string} - a dot program
 */
module.exports = pResults => ({
  output: report(pResults),
  exitCode: 0
});
