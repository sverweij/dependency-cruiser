/* eslint-disable security/detect-non-literal-require */
/* eslint-disable import/no-dynamic-require */
/* eslint-disable node/global-require */
const fs = require("fs");
const json5 = require("json5");
const _get = require("lodash/get");
const tryRequire = require("semver-try-require");
const $package = require("../../package.json");

function getConfig(pBabelConfigFileName) {
  let lReturnValue = {};

  lReturnValue = json5.parse(fs.readFileSync(pBabelConfigFileName, "utf8"));

  if (pBabelConfigFileName.endsWith("package.json")) {
    lReturnValue = _get(lReturnValue, "babel", {});
  }
  return lReturnValue;
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
