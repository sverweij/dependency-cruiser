const tryRequire = require("semver-try-require");
const $package = require("../../../package.json");

const babel = tryRequire("@babel/core", $package.supportedTranspilers.babel);

module.exports = {
  isAvailable: () => babel !== false,
  transpile: (pSource, pFileName, pTranspileOptions = {}) =>
    babel.transformSync(pSource, {
      ...(pTranspileOptions.babelConfig || {}),
      // Some babel plugins assume a piece of source to have a filename.
      // See https://github.com/sverweij/dependency-cruiser/issues/410
      filename: pFileName,
    }).code,
};
