// @ts-check
import Handlebars from "handlebars/runtime.js";
import { folderNameArrayToRE } from "./utl.mjs";

/* eslint import/no-unassigned-import: 0 */
await import("./config.js.template.js");

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
 * @param {import("./types.js").IInitConfig} pNormalizedInitOptions Options that influence the shape of
 *                  the configuration
 * @returns {string} the configuration as a string
 */

export default function buildConfig(pNormalizedInitOptions) {
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
}
