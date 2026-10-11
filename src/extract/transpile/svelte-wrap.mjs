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
    return compileWithAsyncFallback(lPreProcessedSource);
  };
}

/**
 * svelte >= 5.36 compiles `await` at a component's top level, in $derived and
 * in markup only when the `experimental.async` compiler option is set (svelte 6
 * makes async the default and drops the option). Compile without it first, so
 * the output of every other component stays exactly what it was, and retry
 * with the option only when svelte reports the `experimental_async` error.
 *
 * @param {string} pSource
 * @returns {string}
 */
function compileWithAsyncFallback(pSource) {
  try {
    // in svelte 5 one must provide the second argument
    // lest it throws because it's accessing a property
    // in it. In svelte 4 (which also takes compiler
    // options there) this isn't necessary.
    return compile(pSource, {}).js.code;
  } catch (pError) {
    if (pError?.code === "experimental_async") {
      return compile(pSource, { experimental: { async: true } }).js.code;
    }
    throw pError;
  }
}

export default function svelteWrap(pTranspilerWrapper) {
  return {
    isAvailable: () => Boolean(compile),
    version: () => `svelte/compiler@${VERSION}`,
    transpile: getTranspiler(pTranspilerWrapper),
  };
}
