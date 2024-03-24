import javaScriptWrap from "./javascript-wrap.mjs";
import typeScriptWrap from "./typescript-wrap.mjs";
import liveScriptWrap from "./livescript-wrap.mjs";
import coffeeWrap from "./coffeescript-wrap.mjs";
import vueWrap from "./vue-template-wrap.cjs";
import babelWrap from "./babel-wrap.mjs";
import svelteDingus from "./svelte-wrap.mjs";

const typeScriptVanillaWrap = typeScriptWrap();
const typeScriptESMWrap = typeScriptWrap("esm");
const typeScriptTsxWrap = typeScriptWrap("tsx");
const coffeeVanillaWrap = coffeeWrap();
const litCoffeeWrap = coffeeWrap(true);
const svelteWrap = svelteDingus(typeScriptVanillaWrap);

export const EXTENSION2WRAPPER = new Map([
  [".js", javaScriptWrap],
  [".cjs", javaScriptWrap],
  [".mjs", javaScriptWrap],
  [".jsx", javaScriptWrap],
  [".ts", typeScriptVanillaWrap],
  [".tsx", typeScriptTsxWrap],
  [".d.ts", typeScriptVanillaWrap],
  [".cts", typeScriptVanillaWrap],
  [".d.cts", typeScriptVanillaWrap],
  [".mts", typeScriptESMWrap],
  [".d.mts", typeScriptESMWrap],
  [".vue", vueWrap],
  [".svelte", svelteWrap],
  [".ls", liveScriptWrap],
  [".coffee", coffeeVanillaWrap],
  [".litcoffee", litCoffeeWrap],
  [".coffee.md", litCoffeeWrap],
  [".csx", coffeeVanillaWrap],
  [".cjsx", coffeeVanillaWrap],
]);

const BABEL_ABLE_EXTENSIONS = [
  ".js",
  ".cjs",
  ".mjs",
  ".jsx",
  ".ts",
  ".tsx",
  ".d.ts",
];

/**
 * returns the babel wrapper if there's a babelConfig in the transpiler
 * options for babel-  able extensions (javascript and typescript - currently
 * not configurable)
 *
 * returns the wrapper module configured for the extension pExtension if
 * not.
 *
 * returns the javascript wrapper if there's no wrapper module configured
 * for the extension.
 *
 * @param {string}  pExtension the extension (e.g. ".ts", ".js", ".litcoffee")
 * @param {any} pTranspilerOptions
 * @returns {module} the module
 */
export function getWrapper(pExtension, pTranspilerOptions) {
  if (
    Object.keys(pTranspilerOptions?.babelConfig ?? {}).length > 0 &&
    BABEL_ABLE_EXTENSIONS.includes(pExtension)
  ) {
    return babelWrap;
  }

  return EXTENSION2WRAPPER.get(pExtension) || javaScriptWrap;
}

/**
 * Transpiles the string pFile with the transpiler configured for extension
 * pExtension (e.g. for extension ".ts" transpiles ) - if a supported version
 * for it is available.
 *
 * Returns the string pFile in all other cases
 *
 * @see section "supportedTranspilers" in [package.json](../../../package.json)
 *      for supported versions of transpilers
 * @see [meta.cjs](meta.cjs) for the extension -> transpiler mapping
 *
 * @param  {{ extension:string; source:string; filename:string; }} pFileRecord      Record with source code, an extension and a filename
 * @param  {any} pTranspilerOptions (optional) object with options influencing
 *                                the underlying transpiler behavior.
 * @return {string}               the transpiled version of the file (or the file
 *                                itself when the function could not find a
 *                                transpiler matching pExtension
 */
export default function transpile(
  { extension, source, filename },
  pTranspilerOptions,
) {
  const lWrapper = getWrapper(extension, pTranspilerOptions);

  if (lWrapper.isAvailable()) {
    return lWrapper.transpile(source, filename, pTranspilerOptions);
  } else {
    return source;
  }
}
