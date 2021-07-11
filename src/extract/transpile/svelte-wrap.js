const tryRequire = require("semver-try-require");
const { supportedTranspilers } = require("../../../src/meta.js");

const svelteCompiler = tryRequire(
  "svelte/compiler",
  supportedTranspilers.svelte
);
const preProcess = require("./svelte-preprocess");

function getTranspiler(pTranspilerWrapper) {
  return (pSource, _pFileName, pTranspilerOptions) => {
    const lPreProcessedSource = preProcess(
      pSource,
      pTranspilerWrapper,
      pTranspilerOptions
    );
    return svelteCompiler.compile(lPreProcessedSource).js.code;
  };
}

module.exports = function svelteWrap(pTranspilerWrapper) {
  return {
    isAvailable: () => svelteCompiler !== false,
    transpile: getTranspiler(pTranspilerWrapper),
  };
};
