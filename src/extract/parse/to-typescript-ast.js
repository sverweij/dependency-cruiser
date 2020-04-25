const fs = require("fs");
const tryRequire = require("semver-try-require");
const _memoize = require("lodash/memoize");
const typescript = tryRequire(
  "typescript",
  require("../../../package.json").supportedTranspilers.typescript
);

/**
 * Compiles pTypescriptSource into a (typescript) AST
 *
 * @param {string} pTypescriptSource - the source to compile
 * @param {string} [pFileName] - (optional) file name the typescript
 *                              compiler can use in error messages
 * @return {object} - a (typescript) AST
 */
function getASTFromSource(pTypescriptSource, pFileName) {
  return typescript.createSourceFile(
    pFileName || "$internal-file-name",
    pTypescriptSource,
    typescript.ScriptTarget.Latest,
    false
  );
}

/**
 * Compiles the file identified by pFileName into a (typescript)
 * AST and returns it
 *
 * @param {string} pFileName - the name of the file to compile
 * @return {object} - a (typescript) AST
 */
function getAST(pFileName) {
  // reading files is kind of the point, so disabled that check here...
  return getASTFromSource(fs.readFileSync(pFileName, "utf8"), pFileName);
}

const getASTCached = _memoize(getAST);

function clearCache() {
  getASTCached.cache.clear();
}

module.exports = {
  getASTFromSource,

  /**
   * @return {boolean} - true if the typescript compiler is available,
   *                     false in all other cases
   */
  isAvailable: () => typescript !== false,

  /**
   * Compiles the file identified by pFileName into a (typescript)
   * AST and returns it. Subsequent calls for the same file name will
   * return the result from a cache
   *
   * @param {string} pFileName - the name of the file to compile
   * @return {object} - a (typescript) AST
   */
  getASTCached,

  clearCache,
};
