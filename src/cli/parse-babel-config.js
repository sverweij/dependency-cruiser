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

const JAVASCRIPT_EXTENSIONS = [".js", ".cjs"];

function getConfig(pBabelConfigFileName) {
  let lReturnValue = {};

  if (JAVASCRIPT_EXTENSIONS.includes(path.extname(pBabelConfigFileName))) {
    lReturnValue = require(makeAbsolute(pBabelConfigFileName));

    if (typeof lReturnValue === "function") {
      // Function format configs not supported yet. Will need calling the
      // function with a bunch of params (lReturnValue = lReturnValue(APIPAPI))
      // TODO: should we pass this in silence or throw?
      //   +silence: there's nothing wrong (we can detect)
      //   +throw: at least it's clear we don't support it
      lReturnValue = {};
    }
  } else {
    lReturnValue = json5.parse(fs.readFileSync(pBabelConfigFileName, "utf8"));

    if (pBabelConfigFileName.endsWith("package.json")) {
      lReturnValue = _get(lReturnValue, "babel", {});
    }
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
