const tryRequire = require("semver-try-require");
const memoize = require("lodash/memoize");
const { supportedTranspilers } = require("../../../src/meta.js");

/** @type {import('@swc/core')} */
const swc = tryRequire("@swc/core", supportedTranspilers.swc);

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

function getASTFromSource(pSource) {
  return swc.parseSync(pSource, SWC_PARSE_OPTIONS);
}

function getAST(pFileName) {
  /** @type {import('@swc/core')} swc */
  return swc.parseFileSync(pFileName, SWC_PARSE_OPTIONS);
}

const getASTCached = memoize(getAST);

function clearCache() {
  getASTCached.cache.clear();
}

module.exports = {
  getASTFromSource,

  /**
   * @return {boolean} - true if the swc compiler is available,
   *                     false in all other cases
   */
  // @ts-ignore
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
