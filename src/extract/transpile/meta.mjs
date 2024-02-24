/* eslint security/detect-object-injection : 0*/
import tryAvailable from "./try-import-available.mjs";
import meta from "#meta.cjs";

function gotCoffee() {
  return (
    tryAvailable("coffeescript", meta.supportedTranspilers.coffeescript) ||
    tryAvailable("coffee-script", meta.supportedTranspilers["coffee-script"])
  );
}

const TRANSPILER2AVAILABLE = {
  babel: tryAvailable("@babel/core", meta.supportedTranspilers.babel),
  javascript: true,
  "coffee-script": gotCoffee(),
  coffeescript: gotCoffee(),
  livescript: tryAvailable("livescript", meta.supportedTranspilers.livescript),
  svelte: tryAvailable("svelte/compiler", meta.supportedTranspilers.svelte),
  swc: tryAvailable("@swc/core", meta.supportedTranspilers.swc),
  typescript: tryAvailable("typescript", meta.supportedTranspilers.typescript),
  "vue-template-compiler": tryAvailable(
    "vue-template-compiler",
    meta.supportedTranspilers["vue-template-compiler"],
  ),
  "@vue/compiler-sfc": tryAvailable(
    "@vue/compiler-sfc",
    meta.supportedTranspilers["@vue/compiler-sfc"],
  ),
};

export const EXTENSION2AVAILABLE = new Map([
  [".js", TRANSPILER2AVAILABLE.javascript],
  [".cjs", TRANSPILER2AVAILABLE.javascript],
  [".mjs", TRANSPILER2AVAILABLE.javascript],
  [".jsx", TRANSPILER2AVAILABLE.javascript],
  [".ts", TRANSPILER2AVAILABLE.typescript],
  [".tsx", TRANSPILER2AVAILABLE.typescript],
  [".d.ts", TRANSPILER2AVAILABLE.typescript],
  [".cts", TRANSPILER2AVAILABLE.typescript],
  [".d.cts", TRANSPILER2AVAILABLE.typescript],
  [".mts", TRANSPILER2AVAILABLE.typescript],
  [".d.mts", TRANSPILER2AVAILABLE.typescript],
  [
    ".vue",
    TRANSPILER2AVAILABLE["vue-template-compiler"] ||
      TRANSPILER2AVAILABLE["@vue/compiler-sfc"],
  ],
  [".svelte", TRANSPILER2AVAILABLE.svelte],
  [".ls", TRANSPILER2AVAILABLE.livescript],
  [".coffee", gotCoffee()],
  [".litcoffee", gotCoffee()],
  [".coffee.md", gotCoffee()],
  [".csx", gotCoffee()],
  [".cjsx", gotCoffee()],
]);

const EXTENSIONS_PER_PARSER = {
  swc: [".js", ".cjs", ".mjs", ".jsx", ".ts", ".tsx", ".d.ts"],
  // tsc: [".js", ".cjs", ".mjs", ".jsx", ".ts", ".tsx", ".d.ts"],
  // acorn: [".js", ".cjs", ".mjs", ".jsx"],
};

function extensionIsAvailable(pExtension) {
  return (
    EXTENSION2AVAILABLE.get(pExtension) ||
    // should eventually also check whether swc is enabled as a parser?
    (TRANSPILER2AVAILABLE.swc && EXTENSIONS_PER_PARSER.swc.includes(pExtension))
  );
}

/**
 * all supported extensions and whether or not it is supported
 * in the current environment
 *
 * @type {IAvailableExtension[]}
 */
export const allExtensions = Array.from(EXTENSION2AVAILABLE.keys()).map(
  (pExtension) => ({
    extension: pExtension,
    available: extensionIsAvailable(pExtension),
  }),
);

/**
 * an array of extensions that are 'scannable' (have a valid transpiler
 * available for) in the current environment.
 *
 * @type {string[]}
 */
export const scannableExtensions = Array.from(
  EXTENSION2AVAILABLE.keys(),
).filter(extensionIsAvailable);

/**
 * returns an array of supported transpilers, with for each transpiler:
 * - the version (range) supported
 * - whether or not it is available in the current environment
 *
 * @return {IAvailableTranspiler[]} an array of supported transpilers
 */
export function getAvailableTranspilers() {
  return Object.keys(meta.supportedTranspilers).map((pTranspiler) => ({
    name: pTranspiler,
    version: meta.supportedTranspilers[pTranspiler],
    available: TRANSPILER2AVAILABLE[pTranspiler],
  }));
}
