import tryImport from "#utl/try-import.mjs";
import meta from "#meta.cjs";

/**
 * @type {import("@astrojs/compiler/sync") | false}
 */
const astro = await tryImport(
  "@astrojs/compiler/sync",
  meta.supportedTranspilers["@astrojs/compiler"],
);

/**
 * @type {import("./meta".ITranspilerWrapper)}
 */
export default {
  isAvailable: () => astro !== false,

  version: () => "@astrojs/compiler/sync",

  transpile: (pSource, pFileName) => {
    // @astrojs/compiler/sync does not support sync version of `transform`
    // so using `convertToTSX` instead
    return astro.convertToTSX(pSource, {
      filename: pFileName,
      includeStyles: false,
    }).code;
  },
};
