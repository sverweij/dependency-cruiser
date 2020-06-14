/* eslint-disable security/detect-non-literal-require */
/* eslint-disable import/no-dynamic-require */
/* eslint-disable node/global-require */
const fs = require("fs");
const path = require("path");
const json5 = require("json5");
const _get = require("lodash/get");
const tryRequire = require("semver-try-require");
const $package = require("../../package.json");
const makeAbsolute = require("./utl/make-absolute");

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
  const EXTENSION_TO_PARSE_FN = {
    ".js": getCommonJSConfig,
    ".cjs": getCommonJSConfig,
    "": getJSON5Config,
    ".json": getJSON5Config,
    ".json5": getJSON5Config,
  };
  const lExtension = path.extname(pBabelConfigFileName);

  if (
    !Object.prototype.hasOwnProperty.call(EXTENSION_TO_PARSE_FN, lExtension)
  ) {
    throw new Error(
      `The babel config '${pBabelConfigFileName}' is in a format ('${lExtension}')\n` +
        "         dependency-cruiser doesn't support yet.\n"
    );
  }
  // eslint-disable-next-line security/detect-object-injection
  return EXTENSION_TO_PARSE_FN[lExtension](pBabelConfigFileName);
}

module.exports = function parseBabelConfig(pBabelConfigFileName) {
  let lReturnValue = {};
  const babel = tryRequire("@babel/core", $package.supportedTranspilers.babel);

  /* istanbul ignore else */
  if (babel) {
    lReturnValue = babel.loadOptions(getConfig(pBabelConfigFileName));
  }

  return lReturnValue;
};
