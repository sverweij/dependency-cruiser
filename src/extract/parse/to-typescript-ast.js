const fs = require("fs");
const tryRequire = require("semver-try-require");
const memoize = require("lodash/memoize");
const { supportedTranspilers } = require("../../../src/meta.js");
const transpile = require("../transpile");
const getExtension = require("../utl/get-extension");

/** @type {import('typescript')} */
const typescript = tryRequire("typescript", supportedTranspilers.typescript);

/**
 * Compiles pTypescriptSource into a (typescript) AST
 *
 * @param {object} pFileRecord Record with source code, an extension and a filename
 * @param {any} [pTranspileOptions] options for the transpiler(s) - a tsconfig or
 *                                a babel config
 * @return {object} - a (typescript) AST
 */
function getASTFromSource(pFileRecord, pTranspileOptions) {
  let lSource = pFileRecord.source;
  if (pFileRecord.extension === ".vue") {
    lSource = transpile(pFileRecord, pTranspileOptions);
  }

  return typescript.createSourceFile(
    pFileRecord.filename || "$internal-file-name",
    lSource,
    typescript.ScriptTarget.Latest,
    false
  );
}

/**
 * Compiles the file identified by pFileName into a (typescript)
 * AST and returns it
 *
 * @param {string} pFileName - the name of the file to compile
 * @param {any} [pTranspileOptions] options for the transpiler(s) - a tsconfig or
 *                                a babel config
 * @return {object} - a (typescript) AST
 */
function getAST(pFileName, pTranspileOptions) {
  return getASTFromSource(
    {
      source: fs.readFileSync(pFileName, "utf8"),
      extension: getExtension(pFileName),
      filename: pFileName,
    },
    pTranspileOptions
  );
}

const getASTCached = memoize(getAST);

function clearCache() {
  getASTCached.cache.clear();
}

module.exports = {
  getASTFromSource,

  /**
   * @return {boolean} - true if the typescript compiler is available,
   *                     false in all other cases
   */
  // @ts-ignore
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
