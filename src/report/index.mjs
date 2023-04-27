import { getExternalPluginReporter } from "./plugins.mjs";

const TYPE2MODULE = {
  anon: "./anon/index.mjs",
  csv: "./csv.mjs",
  dot: "./dot/dot-module.mjs",
  ddot: "./dot/dot-folder.mjs",
  cdot: "./dot/dot-custom.mjs",
  archi: "./dot/dot-custom.mjs",
  fdot: "./dot/dot-flat.mjs",
  flat: "./dot/dot-flat.mjs",
  "err-html": "./error-html/index.mjs",
  markdown: "./markdown.mjs",
  "err-long": "./error-long.mjs",
  err: "./error.mjs",
  html: "./html/index.mjs",
  json: "./json.mjs",
  teamcity: "./teamcity.mjs",
  text: "./text.mjs",
  baseline: "./baseline.mjs",
  metrics: "./metrics.mjs",
  mermaid: "./mermaid.mjs",
  null: "./null.mjs",
};

/**
 * Returns the reporter function associated with given output type,
 * or the identity reporter if that output type wasn't found
 *
 * @param {import("../../types/shared-types.js").OutputType} pOutputType -
 * @returns {function} - a function that takes an ICruiseResult, optionally
 *                       an options object (specific to that function)
 *                       and returns an IReporterOutput
 */
async function getReporter(pOutputType) {
  let lReturnValue = {};
  if (pOutputType?.startsWith("plugin:")) {
    lReturnValue = await getExternalPluginReporter(pOutputType);
  } else {
    const lModuleToImport =
      // eslint-disable-next-line security/detect-object-injection
      TYPE2MODULE[pOutputType] || "./identity.mjs";
    const lModule = await import(lModuleToImport);
    lReturnValue = lModule.default;
  }
  return lReturnValue;
}

/**
 * Returns a list of all currently available reporters
 *
 * @returns {import("../../types/shared-types.js").OutputType[]} -
 */
function getAvailableReporters() {
  return Object.keys(TYPE2MODULE);
}

export default {
  getAvailableReporters,
  getReporter,
};
