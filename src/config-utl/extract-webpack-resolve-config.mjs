// @ts-check
import { extname } from "node:path";
import { createRequire } from "node:module";
import makeAbsolute from "./make-absolute.mjs";

const require = createRequire(import.meta.url);

function pryConfigFromTheConfig(
  pWebpackConfigModule,
  pEnvironment,
  pArguments,
) {
  let lReturnValue = pWebpackConfigModule;

  if (typeof pWebpackConfigModule === "function") {
    lReturnValue = pWebpackConfigModule(pEnvironment, pArguments);
  }

  if (Array.isArray(pWebpackConfigModule)) {
    lReturnValue = pryConfigFromTheConfig(
      pWebpackConfigModule[0],
      pEnvironment,
      pArguments,
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
      (pAll, pCurrent) => `${pAll}         - ${pCurrent.module || pCurrent}\n`,
      `\n         Some npm modules that might fix that problem (one of which you'll` +
        `\n         need so '${pWebpackConfigFilename}' works with webpack anyway):\n`,
    );
  }
  return lReturnValue;
}

function tryRegisterNonNative(pWebpackConfigFilename) {
  const lConfigExtension = extname(pWebpackConfigFilename);
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
          pWebpackConfigFilename,
        )}`,
    );
  }
}

function isNativelySupported(pWebpackConfigFilename) {
  const lNativelySupportedExtensions = [
    ".js",
    ".cjs",
    ".mjs",
    ".json",
    ".node",
  ];
  const lWebpackConfigExtension = extname(pWebpackConfigFilename);
  return lNativelySupportedExtensions.includes(lWebpackConfigExtension);
}

async function attemptImport(pAbsoluteWebpackConfigFileName) {
  try {
    if (isNativelySupported(pAbsoluteWebpackConfigFileName)) {
      const { default: lModule } = await import(
        `file://${pAbsoluteWebpackConfigFileName}`
      );
      return lModule;
    } else {
      tryRegisterNonNative(pAbsoluteWebpackConfigFileName);
      /* we're using still using require instead of dynamic imports here because
       * the modules webpack uses for non-native formats monkey-patch on the commonjs
       * module system. If we'd use a dynamic import, these monkey-patches wouldn't
       * be used.
       */
      /* eslint node/global-require:0, security/detect-non-literal-require:0, import/no-dynamic-require:0 */
      return require(pAbsoluteWebpackConfigFileName);
    }
  } catch (pError) {
    throw new Error(
      `The webpack config '${pAbsoluteWebpackConfigFileName}' seems to be not quite valid for use:` +
        `\n\n          "${pError}"\n`,
    );
  }
}

/**
 * Reads the file with name `pWebpackConfigFilename` and (applying the
 * environment `pEnvironment` and the arguments `pArguments` (which can
 * either be a string or a keys-values object)) returns the resolve config
 * from it as an object.
 *
 * @typedef {{ [key: string]: any } | string} webpackArgumentsType
 *
 * @param {string} pWebpackConfigFilename
 * @param {{ [key: string]: any }=} pEnvironment
 * @param {webpackArgumentsType=} pArguments
 * @return {Promise<import("enhanced-resolve").ResolveOptions|{}>} webpack resolve config as an object
 * @throws {Error} when the webpack config isn't usable (e.g. because it
 *                 doesn't exist, or because it's invalid)
 */
export default async function extractWebpackResolveConfig(
  pWebpackConfigFilename,
  pEnvironment,
  pArguments,
) {
  let lReturnValue = {};
  const lAbsoluteConfigFilename = makeAbsolute(pWebpackConfigFilename);
  const lWebpackConfig = pryConfigFromTheConfig(
    await attemptImport(lAbsoluteConfigFilename),
    pEnvironment,
    pArguments,
  );

  if (lWebpackConfig.resolve) {
    lReturnValue = lWebpackConfig.resolve;
  }

  return lReturnValue;
}
