// @ts-check
const Handlebars = require("handlebars/runtime");
const { folderNameArrayToRE } = require("./utl");

/* eslint import/no-unassigned-import: 0 */
require("./config.js.template");

/**
 * @param {string} pString
 * @returns {string}
 */
function quote(pString) {
  return `"${pString}"`;
}

/**
 * @param {string[]=} pExtensions
 * @returns {string}
 */
function extensionsToString(pExtensions) {
  if (pExtensions) {
    return `[${pExtensions.map(quote).join(", ")}]`;
  }
  return "";
}

/**
 * Creates a .dependency-cruiser config with a set of basic validations
 * to the current directory.
 *
 * @param {import("./types").IInitConfig} pNormalizedInitOptions Options that influence the shape of
 *                  the configuration
 * @returns {string} the configuration as a string
 */

module.exports = function buildConfig(pNormalizedInitOptions) {
  return Handlebars.templates["config.js.template.hbs"]({
    ...pNormalizedInitOptions,

    sourceLocationRE: folderNameArrayToRE(
      pNormalizedInitOptions.sourceLocation
    ),
    testLocationRE: folderNameArrayToRE(pNormalizedInitOptions.testLocation),
    resolutionExtensionsAsString: extensionsToString(
      pNormalizedInitOptions.resolutionExtensions
    ),
  });
};
