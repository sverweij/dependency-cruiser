const tryRequire = require("semver-try-require");
const svelteCompiler = tryRequire(
  "svelte/compiler",
  require("../../../package.json").supportedTranspilers.svelte
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
