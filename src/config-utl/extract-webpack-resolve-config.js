const { extname } = require("path");
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

function suggestModules(pSuggestionList, pWebpackConfigFilename) {
  let lReturnValue = "";
  let lSuggestionList = pSuggestionList;

  if (pSuggestionList && typeof pSuggestionList === "string") {
    lSuggestionList = [pSuggestionList];
  }

  if (Array.isArray(lSuggestionList) && lSuggestionList.length > 0) {
    lReturnValue = lSuggestionList.reduce(
      (pAll, pCurrent) =>
        (pAll += `         - ${pCurrent.module || pCurrent}\n`),
      `\n         Some npm modules that might fix that problem (one of which you'll` +
        `\n         need so '${pWebpackConfigFilename}' works with webpack anyway):\n`
    );
  }
  return lReturnValue;
}

function tryRegisterNonNative(pWebpackConfigFilename) {
  const lConfigExtension = extname(pWebpackConfigFilename);

  if (lConfigExtension === ".mjs") {
    throw new Error(
      `dependency-cruiser currently does not support webpack configurations in` +
        `\n         ES Module format (like '${pWebpackConfigFilename}').\n`
    );
  }

  const interpret = require("interpret");
  const rechoir = require("rechoir");

  try {
    rechoir.prepare(interpret.extensions, pWebpackConfigFilename);
  } catch (pError) {
    throw new Error(
      `${pError.message}` +
        `\n${suggestModules(
          // eslint-disable-next-line security/detect-object-injection
          interpret.extensions[lConfigExtension],
          pWebpackConfigFilename
        )}`
    );
  }
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
  const lNativelySupportedExtensions = [".js", ".cjs", ".json", ".node"];
  const lWebpackConfigFilename = makeAbsolute(pWebpackConfigFilename);

  if (!lNativelySupportedExtensions.includes(extname(pWebpackConfigFilename))) {
    tryRegisterNonNative(pWebpackConfigFilename);
  }

  try {
    /* eslint node/global-require:0, security/detect-non-literal-require:0, import/no-dynamic-require:0 */
    const lWebpackConfigModule = require(lWebpackConfigFilename);
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
