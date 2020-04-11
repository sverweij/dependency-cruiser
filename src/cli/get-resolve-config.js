const makeAbsolute = require("./utl/make-absolute");

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

module.exports = (pWebpackConfigFilename, pEnvironment, pArguments) => {
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
