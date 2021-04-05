const tryRequire = require("semver-try-require");
const _memoize = require("lodash/memoize");
/** @type {import('@swc/core')} */
const swc = tryRequire(
  "@swc/core",
  require("../../../package.json").supportedTranspilers.swc
);

const SWC_PARSE_OPTIONS = {
  dynamicImport: true,
  // TODO: use ecmascript when it's an ecmascript-ish extension (or as
  // typescript is a superset of ecmascript => typescript always?)
  syntax: "typescript",
  // target doesn't have effect on parsing it seems
  target: "es2020",
  // TODO jsx
};

function getASTFromSource(pSource) {
  return swc.parseSync(pSource, SWC_PARSE_OPTIONS);
}

function getAST(pFileName) {
  return swc.parseFileSync(pFileName, SWC_PARSE_OPTIONS);
}

const getASTCached = _memoize(getAST);

function clearCache() {
  getASTCached.cache.clear();
}

module.exports = {
  getASTFromSource,

  /**
   * @return {boolean} - true if the swc compiler is available,
   *                     false in all other cases
   */
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
