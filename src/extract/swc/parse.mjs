import tryImport from "#utl/try-import.mjs";
import meta from "#meta.cjs";

/**
 * @import swcCore, { ParseOptions, ModuleItem } from "@swc/core";
 */

/** @type {swcCore} */
const swc = await tryImport("@swc/core", meta.supportedTranspilers.swc);

/** @type {ParseOptions} */
const SWC_PARSE_OPTIONS = {
  dynamicImport: true,
  // typescript is a superset of ecmascript, so we use typescript always
  syntax: "typescript",
  // target doesn't have effect on parsing it seems
  target: "es2022",
  // allow for decorators
  decorators: true,
  // no tsx by default - overridden when the extension calls for it (see getOptionsFor)
  // tsx: false
};
/** @type {Map<string, ModuleItem[]>} */
const CACHE = new Map();

/**
 * Returns the parse options necessary to have swc parse the file name
 * pFileName correctly (mainly important for jsx/ tsx)
 *
 * @param {string} pFileName
 * @returns {ParseOptions}
 */
export function getOptionsFor(pFileName) {
  return /[.](?:tsx|jsx)$/.test(pFileName)
    ? { ...SWC_PARSE_OPTIONS, tsx: true }
    : SWC_PARSE_OPTIONS;
}

/**
 * Compiles the file identified by pFileName into an (swc)
 * AST and returns it. Subsequent calls for the same file name will
 * return the result from a cache
 *
 * @param {string} pFileName - the name of the file to compile
 * @returns {ModuleItem[]} - an (swc) AST
 */
export function getASTCached(pFileName) {
  if (CACHE.has(pFileName)) {
    return CACHE.get(pFileName);
  }
  /** @type {swcCore} */
  const lAST = swc.parseFileSync(pFileName, getOptionsFor(pFileName));
  CACHE.set(pFileName, lAST);
  return lAST;
}

export function clearCache() {
  CACHE.clear();
}

/**
 * @returns {boolean} - true if the swc compiler is available,
 *                     false in all other cases
 */
// @ts-expect-error dfdfd
export const isAvailable = () => swc !== false;

export const version = () => `@swc/core@${swc.version}`;
