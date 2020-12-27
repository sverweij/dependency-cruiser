const Handlebars = require("handlebars/runtime");

const { folderNameArrayToRE } = require("./utl");

/* eslint import/no-unassigned-import: 0 */
require("./config.js.template");

/**
 * Creates a .dependency-cruiser config with a set of basic validations
 * to the current directory.
 *
 * @returns {void}  Nothing
 * @param  {any}    pNormalizedInitOptions Options that influence the shape of
 *                  the configuration
 */

module.exports = function buildConfig(pNormalizedInitOptions) {
  return Handlebars.templates["config.js.template.hbs"]({
    ...pNormalizedInitOptions,
    ...{
      sourceLocationRE: folderNameArrayToRE(
        pNormalizedInitOptions.sourceLocation
      ),
      testLocationRE: folderNameArrayToRE(pNormalizedInitOptions.testLocation),
    },
  });
};
