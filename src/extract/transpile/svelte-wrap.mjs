/* eslint-disable no-inline-comments */
import preProcess from "./svelte-preprocess.mjs";
import tryImport from "#utl/try-import.mjs";
import meta from "#meta.cjs";

const { compile, VERSION } = await tryImport(
  "svelte/compiler",
  meta.supportedTranspilers.svelte,
);
/* c8 ignore next */
const MAJOR_VERSION = VERSION ? Number(VERSION.split(".")[0]) : 0;

function getTranspiler(pTranspilerWrapper) {
  return (pSource, _pFileName, pTranspilerOptions) => {
    // svelte 5 natively supports typescript directly, without
    // the need for preprocessing.
    const lPreProcessedSource =
      // eslint-disable-next-line no-magic-numbers
      MAJOR_VERSION < 5
        ? /* c8 ignore next */
          preProcess(pSource, pTranspilerWrapper, pTranspilerOptions)
        : pSource;
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
