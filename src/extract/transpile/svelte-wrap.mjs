import tryImport from "semver-try-require";
import preProcess from "./svelte-preprocess.mjs";
import meta from "#meta.cjs";

const { compile } = await tryImport(
  "svelte/compiler",
  meta.supportedTranspilers.svelte,
);

function getTranspiler(pTranspilerWrapper) {
  return (pSource, _pFileName, pTranspilerOptions) => {
    const lPreProcessedSource = preProcess(
      pSource,
      pTranspilerWrapper,
      pTranspilerOptions,
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
