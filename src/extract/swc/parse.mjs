import tryImport from "semver-try-require";
import memoize, { memoizeClear } from "memoize";
import meta from "#meta.cjs";

/** @type {import('@swc/core')} */
const swc = await tryImport("@swc/core", meta.supportedTranspilers.swc);

/** @type {import('@swc/core').ParseOptions} */
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
  /** @type {import('@swc/core')} swc */
  return swc.parseFileSync(pFileName, SWC_PARSE_OPTIONS);
}

export const getASTCached = memoize(getAST);

export function clearCache() {
  memoizeClear(getASTCached);
}

export default {
  getASTFromSource,

  /**
   * @return {boolean} - true if the swc compiler is available,
   *                     false in all other cases
   */
  // @ts-expect-error dfdfd
  isAvailable: () => swc !== false,

  /**
   * Compiles the file identified by pFileName into an (swc)
   * AST and returns it. Subsequent calls for the same file name will
   * return the result from a cache
   *
   * @param {string} pFileName - the name of the file to compile
   * @return {import('@swc/core').ModuleItem[]} - an (swc) AST
   */
  getASTCached,

  clearCache,
};
