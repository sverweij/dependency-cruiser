import extractDepcruiseConfig from "./extract-depcruise-config/index.mjs";

/**
 *
 * @param {import('../../../types/configuration.mjs').IConfiguration}} pConfiguration
 * @returns {import('../../../types/configuration.mjs').ICruiseOptions}
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
 * @returns {Promise<import('../../../types/configuration.mjs').ICruiseOptions>}
 */
export default async function extractDepcruiseOptions(pConfigFileName) {
  const lReturnValue = await extractDepcruiseConfig(pConfigFileName);
  return configuration2options(lReturnValue);
}
