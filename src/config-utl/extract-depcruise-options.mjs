import extractDepcruiseConfig from "./extract-depcruise-config/index.mjs";

/**
 * @import { IConfiguration } from "../../types/configuration.mjs";
 * @import { ICruiseOptions } from "../../types/options.mjs";
 */

/**
 * @param {IConfiguration} pConfiguration
 * @returns {ICruiseOptions}
 */
function configuration2options(pConfiguration) {
  /* c8 ignore next 1 */
  const lConfiguration = structuredClone(pConfiguration || {});
  const lReturnValue = structuredClone(lConfiguration?.options ?? {});

  delete lConfiguration.options;
  lReturnValue.ruleSet = structuredClone(lConfiguration);
  lReturnValue.validate = Object.keys(lReturnValue.ruleSet).length > 0;

  return lReturnValue;
}

/**
 *
 * @param {string} pConfigFileName
 * @returns {Promise<ICruiseOptions>}
 */
export default async function extractDepcruiseOptions(pConfigFileName) {
  const lReturnValue = await extractDepcruiseConfig(pConfigFileName);
  return configuration2options(lReturnValue);
}
