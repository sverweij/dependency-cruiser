const fs = require("fs");
const acorn = require("acorn");
const acornLoose = require("acorn-loose");
const _memoize = require("lodash/memoize");
const transpile = require("../transpile");
const getExtension = require("../utl/getExtension");

function getASTFromSource(pSource, pExtension, pTSConfig) {
  const lJavaScriptSource = transpile(pExtension, pSource, pTSConfig);

  try {
    // console.log(
    //   JSON.stringify(
    //     acorn.parse(lJavaScriptSource, { sourceType: "module", ecmaVersion: 11 }),
    //     null,
    //     "  "
    //   )
    // );
    // ecmaVersion 11 necessary for acorn to understand dynamic imports
    // default ecmaVersion for acorn 7 is still 10.
    return acorn.parse(lJavaScriptSource, {
      sourceType: "module",
      ecmaVersion: 11
    });
  } catch (e) {
    return acornLoose.parse(lJavaScriptSource, { sourceType: "module" });
  }
}

/**
 * Returns the abstract syntax tree of the module identified by the passed
 * file name. It obtains this by (1) transpiling the contents of the file
 * into javascript (if necessary) (2) parsing it.
 *
 * If parsing fails we fall back to acorn's 'loose' parser
 *
 * @param {string} pFileName path to the file to be parsed
 * @param {any} pTSConfig    (optional) (flattened) typescript config object
 * @returns {object}         the abstract syntax tree
 */
function getAST(pFileName, pTSConfig) {
  return getASTFromSource(
    fs.readFileSync(pFileName, "utf8"),
    getExtension(pFileName),
    pTSConfig
  );
}

const getASTCached = _memoize(
  getAST,
  (pFileName, pTSConfig) => `${pFileName}|${pTSConfig}`
);

function clearCache() {
  getASTCached.cache.clear();
}

module.exports = {
  getASTFromSource,

  /**
   * Compiles the file identified by pFileName into a (javascript)
   * AST and returns it. Subsequent calls for the same file name will
   * return the result from a cache.
   *
   * @param {string} pFileName - the name of the file to compile
   * @return {object} - a (typescript) AST
   */
  getASTCached,

  clearCache
};
