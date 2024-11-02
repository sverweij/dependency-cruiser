import preProcess from "./svelte-preprocess.mjs";
import tryImport from "#utl/try-import.mjs";
import meta from "#meta.cjs";

const { compile, VERSION } = await tryImport(
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
    // in svelte 5 one must provide the second argument
    // lest it throws because it's accessing a property
    // in it. In svelte 4 (which also takes compiler
    // options there) this isn't necessary.
    return compile(lPreProcessedSource, {}).js.code;
  };
}

export default function svelteWrap(pTranspilerWrapper) {
  return {
    isAvailable: () => Boolean(compile),
    version: () => `svelte/compiler@${VERSION}`,
    transpile: getTranspiler(pTranspilerWrapper),
  };
}
