/* eslint-disable security/detect-non-literal-require */
/* eslint-disable import/no-dynamic-require */
/* eslint-disable node/global-require */
const fs = require("fs");
const path = require("path");
const json5 = require("json5");
const _get = require("lodash/get");
const _has = require("lodash/has");
const tryRequire = require("semver-try-require");
const $package = require("../../package.json");
const makeAbsolute = require("./make-absolute");

function getCommonJSConfig(pBabelConfigFileName) {
  let lReturnValue = {};

  try {
    lReturnValue = require(makeAbsolute(pBabelConfigFileName));
  } catch (pError) {
    throw new Error(
      `Encountered an error while parsing babel config '${pBabelConfigFileName}':` +
        `\n\n          ${pError}` +
        "\n\n         At this time dependency-cruiser only supports babel configurations\n" +
        "         in either commonjs or json5.\n"
    );
  }

  if (typeof lReturnValue === "function") {
    // Function format configs not supported yet. Will need calling the
    // function with a bunch of params (lReturnValue = lReturnValue(APIPAPI))
    throw new TypeError(
      `The babel config '${pBabelConfigFileName}' returns a function. At this time\n` +
        `         dependency-cruiser doesn't support that yet.`
    );
  }
  return lReturnValue;
}

function getJSON5Config(pBabelConfigFileName) {
  let lReturnValue = {};

  try {
    lReturnValue = json5.parse(fs.readFileSync(pBabelConfigFileName, "utf8"));
  } catch (pError) {
    throw new Error(
      `Encountered an error while parsing the babel config '${pBabelConfigFileName}':` +
        `\n\n          ${pError}\n`
    );
  }

  if (pBabelConfigFileName.endsWith("package.json")) {
    lReturnValue = _get(lReturnValue, "babel", {});
  }
  return lReturnValue;
}

function getConfig(pBabelConfigFileName) {
  const lExtensionToParseFunction = {
    ".js": getCommonJSConfig,
    ".cjs": getCommonJSConfig,
    "": getJSON5Config,
    ".json": getJSON5Config,
    ".json5": getJSON5Config,
  };
  const lExtension = path.extname(pBabelConfigFileName);

  if (!_has(lExtensionToParseFunction, lExtension)) {
    throw new Error(
      `The babel config '${pBabelConfigFileName}' is in a format ('${lExtension}')\n` +
        "         dependency-cruiser doesn't support yet.\n"
    );
  }
  // eslint-disable-next-line security/detect-object-injection
  return lExtensionToParseFunction[lExtension](pBabelConfigFileName);
}

/**
 * Reads the file with name `pBabelConfigFileName` and returns its parsed
 * contents as an object
 *
 * Silently fails if a supported @babel/core version can't be found
 *
 * @param {string} pBabelConfigFileName
 * @return {any} babel config as an object
 * @throws {Error} when the babel config has an unknown extension OR
 *                 when the babel config is invalid OR
 *                 when dependency-cruiser can't yet process it
 */
module.exports = function extractBabelConfig(pBabelConfigFileName) {
  let lReturnValue = {};
  const babel = tryRequire("@babel/core", $package.supportedTranspilers.babel);

  /* istanbul ignore else */
  if (babel) {
    const lConfig = {
      ...getConfig(pBabelConfigFileName),
      // under some circumstances babel (and/ or its plugins) really likes to
      // have a filename to go with the config - so we pass it
      filename: pBabelConfigFileName,
    };
    lReturnValue = {
      ...babel.loadOptions(lConfig),
      // according to the babel documentation a config parsed & expanded through
      // loadOptions can be passed to the parser. With some plugins/ presets
      // this does not seem to be true anymore, though
      ...(lConfig.presets ? { presets: lConfig.presets } : {}),
    };
  }

  return lReturnValue;
};
