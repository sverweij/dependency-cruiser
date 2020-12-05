const makeAbsolute = require("./make-absolute");

function pryConfigFromTheConfig(
  pWebpackConfigModule,
  pEnvironment,
  pArguments
) {
  let lReturnValue = pWebpackConfigModule;

  if (typeof pWebpackConfigModule === "function") {
    lReturnValue = pWebpackConfigModule(pEnvironment, pArguments);
  }

  if (Array.isArray(pWebpackConfigModule)) {
    lReturnValue = pryConfigFromTheConfig(
      pWebpackConfigModule[0],
      pEnvironment,
      pArguments
    );
  }

  return lReturnValue;
}

/**
 * Reads the file with name `pWebpackConfigFilename` and (applying the
 * environment `pEnvironment` and the arguments `pArguments` (which can
 * either be a string or a keys-values object)) returns the resolve config
 * from it as an object.
 *
 * @param {string} pWebpackConfigFilename
 * @param {string=} pEnvironment
 * @param {string|any=} pArguments
 * @return {any} webpack resolve config as an object
 * @throws {Error} when the webpack config isn't usable (e.g. because it
 *                 doesn't exist, or because it's invalid)
 */
module.exports = function extractWebpackResolveConfig(
  pWebpackConfigFilename,
  pEnvironment,
  pArguments
) {
  let lReturnValue = {};

  try {
    /* eslint node/global-require:0, security/detect-non-literal-require:0, import/no-dynamic-require:0 */
    const lWebpackConfigModule = require(makeAbsolute(pWebpackConfigFilename));
    const lWebpackConfig = pryConfigFromTheConfig(
      lWebpackConfigModule,
      pEnvironment,
      pArguments
    );

    if (lWebpackConfig.resolve) {
      lReturnValue = lWebpackConfig.resolve;
    }
  } catch (pError) {
    throw new Error(
      `The webpack config '${pWebpackConfigFilename}' seems to be not quite valid for use:` +
        `\n\n          "${pError}"\n`
    );
  }

  return lReturnValue;
};
