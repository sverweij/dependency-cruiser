const tryRequire = require("semver-try-require");
const $package = require("../../../package.json");

const babel = tryRequire("@babel/core", $package.supportedTranspilers.babel);

module.exports = {
  isAvailable: () => babel !== false,
  transpile: (pSource, pTranspileOptions = {}) =>
    babel.transformSync(pSource, pTranspileOptions.babelConfig || {}).code,
};
