const tryRequire = require("semver-try-require");
const $package = require("../../../package.json");

const babel = tryRequire("@babel/core", $package.supportedTranspilers.babel);

module.exports = {
  isAvailable: () => babel !== false,
  transpile: (pSource, pTranspileOptions = {}) =>
    babel.transformSync(pSource, {
      ...(pTranspileOptions.babelConfig || {}),
      // some babel plugins assume a piece of source to have a filename.
      // This gives them that.
      filename: "dummy-filename",
    }).code,
};
