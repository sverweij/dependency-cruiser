import tryImport from "semver-try-require";
import meta from "../../meta.js";
import preProcess from "./svelte-preprocess.mjs";

const { compile } = await tryImport(
  "svelte/compiler",
  meta.supportedTranspilers.svelte
);

function getTranspiler(pTranspilerWrapper) {
  return (pSource, _pFileName, pTranspilerOptions) => {
    const lPreProcessedSource = preProcess(
      pSource,
      pTranspilerWrapper,
      pTranspilerOptions
    );
    return compile(lPreProcessedSource).js.code;
  };
}

export default function svelteWrap(pTranspilerWrapper) {
  return {
    isAvailable: () => Boolean(compile),
    transpile: getTranspiler(pTranspilerWrapper),
  };
}
