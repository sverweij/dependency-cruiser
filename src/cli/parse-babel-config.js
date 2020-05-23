const fs = require("fs");
const json5 = require("json5");
const tryRequire = require("semver-try-require");
const $package = require("../../package.json");

module.exports = function parseBabelConfig(pBabelConfigFileName) {
  let lReturnValue = {};
  const babel = tryRequire("@babel/core", $package.supportedTranspilers.babel);

  /* istanbul ignore else */
  if (babel) {
    lReturnValue = babel.loadOptions(
      json5.parse(fs.readFileSync(pBabelConfigFileName, "utf8"))
    );
  }

  return lReturnValue;
};
