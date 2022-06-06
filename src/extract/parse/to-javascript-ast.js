const fs = require("fs");
const acorn = require("acorn");
const acornLoose = require("acorn-loose");
const acornJsx = require("acorn-jsx");
const get = require("lodash/get");
const memoize = require("lodash/memoize");
const transpile = require("../transpile");
const getExtension = require("../utl/get-extension");

/** @type acorn.Options */
const ACORN_OPTIONS = {
  sourceType: "module",
  ecmaVersion: 11,
};

const TSCONFIG_CONSTANTS = {
  PRESERVE_JSX: 1,
};
const acornJsxParser = acorn.Parser.extend(acornJsx());

function needsJSXTreatment(pFileRecord, pTranspileOptions) {
  return (
    pFileRecord.extension === ".jsx" ||
    (pFileRecord.extension === ".tsx" &&
      get(pTranspileOptions, "tsConfig.options.jsx") ===
        TSCONFIG_CONSTANTS.PRESERVE_JSX)
  );
}

function getASTFromSource(pFileRecord, pTranspileOptions) {
  const lJavaScriptSource = transpile(pFileRecord, pTranspileOptions);

  try {
    if (needsJSXTreatment(pFileRecord, pTranspileOptions)) {
      return acornJsxParser.parse(lJavaScriptSource, {
        ...ACORN_OPTIONS,
        // @ts-ignore
        // acornJsxParser.parse takes an acorn.Options which doesn't include
        // allowNamespacedObjects. acornJsx.Options doesn't include sourceType
        // though, so a bit rock < this code > hard place hence ignore it
        // type wise
        allowNamespacedObjects: true,
      });
    }

    // ecmaVersion 11 necessary for acorn to understand dynamic imports
    // explicitly passing ecmaVersion is recommended from acorn 8
    return acorn.parse(lJavaScriptSource, ACORN_OPTIONS);
  } catch (pError) {
    return acornLoose.parse(lJavaScriptSource, ACORN_OPTIONS);
  }
}

/**
 * Returns the abstract syntax tree of the module identified by the passed
 * file name. It obtains this by (1) transpiling the contents of the file
 * into javascript (if necessary) (2) parsing it.
 *
 * If parsing fails we fall back to acorn's 'loose' parser
 *
 * @param {string} pFileName      path to the file to be parsed
 * @param {any} pTranspileOptions options for the transpiler(s) - a tsconfig or
 *                                a babel config
 * @returns {acorn.Node}              the abstract syntax tree
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

const getASTCached = memoize(
  getAST,
  (pFileName, pTranspileOptions) => `${pFileName}|${pTranspileOptions}`
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
   * @param {any} pTranspileOptions - options for the transpiler(s) - typically a tsconfig or a babel config
   * @return {acorn.Node} - a (javascript) AST
   */
  getASTCached,

  clearCache,
};
