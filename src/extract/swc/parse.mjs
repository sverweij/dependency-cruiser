import memoize, { memoizeClear } from "memoize";
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
  // TODO: {tj}sx ?
};

export function getASTFromSource(pSource) {
  return swc.parseSync(pSource, SWC_PARSE_OPTIONS);
}

function getAST(pFileName) {
  /** @type {swcCore swc} */
  return swc.parseFileSync(pFileName, SWC_PARSE_OPTIONS);
}

/**
 * Compiles the file identified by pFileName into an (swc)
 * AST and returns it. Subsequent calls for the same file name will
 * return the result from a cache
 *
 * @param {string} pFileName - the name of the file to compile
 * @return {ModuleItem[]} - an (swc) AST
 */
export const getASTCached = memoize(getAST);

export function clearCache() {
  memoizeClear(getASTCached);
}

/**
 * @return {boolean} - true if the swc compiler is available,
 *                     false in all other cases
 */
// @ts-expect-error dfdfd
export const isAvailable = () => swc !== false;

export const version = () => `@swc/core@${swc.version}`;
