import { getExternalPluginReporter } from "./plugins.mjs";

const TYPE2MODULE = new Map([
  ["anon", "./anon/index.mjs"],
  ["archi", "./dot/dot-custom.mjs"],
  ["azure-devops", "./azure-devops.mjs"],
  ["baseline", "./baseline.mjs"],
  ["cdot", "./dot/dot-custom.mjs"],
  ["csv", "./csv.mjs"],
  ["d2", "./d2.mjs"],
  ["ddot", "./dot/dot-folder.mjs"],
  ["dot", "./dot/dot-module.mjs"],
  ["err-html", "./error-html/index.mjs"],
  ["err-long", "./error-long.mjs"],
  ["err", "./error.mjs"],
  ["fdot", "./dot/dot-flat.mjs"],
  ["flat", "./dot/dot-flat.mjs"],
  ["html", "./html/index.mjs"],
  ["json", "./json.mjs"],
  ["markdown", "./markdown.mjs"],
  ["mermaid", "./mermaid.mjs"],
  ["metrics", "./metrics.mjs"],
  ["null", "./null.mjs"],
  ["teamcity", "./teamcity.mjs"],
  ["text", "./text.mjs"],
  ["x-dot-webpage", "./dot-webpage/dot-module.mjs"],
]);

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
    const lModuleToImport = TYPE2MODULE.get(pOutputType) ?? "./identity.mjs";
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
  return Array.from(TYPE2MODULE.keys());
}

export default {
  getAvailableReporters,
  getReporter,
};
