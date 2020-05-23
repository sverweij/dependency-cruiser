const tryRequire = require("semver-try-require");
const _get = require("lodash/get");
const typescript = tryRequire(
  "typescript",
  require("../../../package.json").supportedTranspilers.typescript
);

function getCompilerOptions(pTsx, pTSConfig) {
  let lCompilerOptions = {};

  if (pTsx) {
    lCompilerOptions.jsx = "react";
  }

  return {
    target: "es2015",
    ...lCompilerOptions,
    ..._get(pTSConfig, "options", {}),
  };
}

module.exports = (pTsx) => ({
  isAvailable: () => typescript !== false,

  transpile: (pSource, pTranspileOptions = {}) =>
    typescript.transpileModule(pSource, {
      ...(pTranspileOptions.tsConfig || {}),
      compilerOptions: getCompilerOptions(
        pTsx,
        pTranspileOptions.tsConfig || {}
      ),
    }).outputText,
});
