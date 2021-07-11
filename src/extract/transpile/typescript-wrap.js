const tryRequire = require("semver-try-require");
const _get = require("lodash/get");
const { supportedTranspilers } = require("../../../src/meta.js");

const typescript = tryRequire("typescript", supportedTranspilers.typescript);

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

module.exports = function typescriptWrap(pTsx) {
  return {
    isAvailable: () => typescript !== false,

    transpile: (pSource, _pFileName, pTranspileOptions = {}) =>
      typescript.transpileModule(pSource, {
        ...(pTranspileOptions.tsConfig || {}),
        compilerOptions: getCompilerOptions(
          pTsx,
          pTranspileOptions.tsConfig || {}
        ),
      }).outputText,
  };
};
