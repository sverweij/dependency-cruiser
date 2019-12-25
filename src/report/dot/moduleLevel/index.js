const path = require("path").posix;
const Handlebars = require("handlebars/runtime");
const _get = require("lodash/get");
const theming = require("../common/theming");
const folderify = require("../common/folderify");
const compareOnSource = require("../common/compareOnSource");

// eslint-disable-next-line import/no-unassigned-import
require("./dot.template");

function attributizeObject(pObject) {
  return (
    Object.keys(pObject)
      // eslint-disable-next-line security/detect-object-injection
      .map(pKey => `${pKey}="${pObject[pKey]}"`)
      .join(" ")
  );
}

function themeify(pTheme) {
  return pModule => ({
    ...pModule,
    dependencies: pModule.dependencies
      .map(pDependency => ({
        ...pDependency,
        themeAttrs: attributizeObject(
          theming.determineAttributes(pDependency, pTheme.dependencies)
        )
      }))
      .map(pDependency => ({
        ...pDependency,
        hasExtraAttributes: Boolean(pDependency.rule || pDependency.themeAttrs)
      })),
    themeAttrs: attributizeObject(
      theming.determineAttributes(pModule, pTheme.modules)
    )
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
        : { URL: concatenateify(lPrefix, pModule.source) }
    );
}

function report(pResults, pTheme) {
  const lTheme = theming.normalizeTheme(pTheme);

  return Handlebars.templates["dot.template.hbs"]({
    graphAttrs: attributizeObject(lTheme.graph || {}),
    nodeAttrs: attributizeObject(lTheme.node || {}),
    edgeAttrs: attributizeObject(lTheme.edge || {}),
    modules: pResults.modules
      .sort(compareOnSource)
      .map(extractFirstTransgression)
      .map(folderify)
      .map(themeify(lTheme))
      .map(addURL(pResults))
  });
}

/**
 * Returns the results of a cruise as a directed graph in the dot language.
 *
 * @param {any} pResults - the output of a dependency-cruise adhering to ../../../schema/cruise-result.schema.json
 * @param {any} pTheme - a mapping of source properties to a attributes (like
 *                      color, shape) - see ../comon/richTheme.json for an example
 * @returns {object} - output: a dot program
 *                     exitCode: 0
 */
module.exports = (
  pResults,
  pTheme = _get(pResults, "summary.optionsUsed.reporterOptions.dot.theme")
) => ({
  output: report(pResults, pTheme),
  exitCode: 0
});
