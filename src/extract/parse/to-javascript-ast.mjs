import { readFileSync } from "node:fs";
import { Parser as acornParser, parse as acornParse } from "acorn";
import { parse as acornLooseParse } from "acorn-loose";
import acornJsx from "acorn-jsx";
import memoize, { memoizeClear } from "memoize";
import transpile from "../transpile/index.mjs";
import getExtension from "#utl/get-extension.mjs";

/** @type acorn.Options */
const ACORN_OPTIONS = {
  sourceType: "module",
  ecmaVersion: 11,
};

const TSCONFIG_CONSTANTS = {
  PRESERVE_JSX: 1,
};
const acornJsxParser = acornParser.extend(acornJsx());

function needsJSXTreatment(pFileRecord, pTranspileOptions) {
  return (
    pFileRecord.extension === ".jsx" ||
    (pFileRecord.extension === ".tsx" &&
      pTranspileOptions?.tsConfig?.options?.jsx ===
        TSCONFIG_CONSTANTS.PRESERVE_JSX)
  );
}

export function getASTFromSource(pFileRecord, pTranspileOptions) {
  const lJavaScriptSource = transpile(pFileRecord, pTranspileOptions);

  try {
    if (needsJSXTreatment(pFileRecord, pTranspileOptions)) {
      return acornJsxParser.parse(lJavaScriptSource, {
        ...ACORN_OPTIONS,
        // @ts-expect-error because ...
        // acornJsxParser.parse takes an acorn.Options which doesn't include
        // allowNamespacedObjects. acornJsx.Options doesn't include sourceType
        // though, so a bit rock < this code > hard place hence ignore it
        // type wise
        allowNamespacedObjects: true,
      });
    }

    // ecmaVersion 11 necessary for acorn to understand dynamic imports
    // explicitly passing ecmaVersion is recommended from acorn 8
    return acornParse(lJavaScriptSource, ACORN_OPTIONS);
  } catch (pError) {
    return acornLooseParse(lJavaScriptSource, ACORN_OPTIONS);
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
      source: readFileSync(pFileName, "utf8"),
      extension: getExtension(pFileName),
      filename: pFileName,
    },
    pTranspileOptions,
  );
}

/**
 * Compiles the file identified by pFileName into a (javascript)
 * AST and returns it. Subsequent calls for the same file name will
 * return the result from a cache.
 *
 * @param {string} pFileName - the name of the file to compile
 * @param {any} pTranspileOptions - options for the transpiler(s) - typically a tsconfig or a babel config
 * @return {acorn.Node} - a (javascript) AST
 */
// taking the transpile options into account of the memoize cache key seems like
// a good idea. However, previously we use `${pTranspileOptions}` which always
// serializes to [object Object], which doesn't help. So for now we're not
// taking the transpile options into account. If we ever need to, it'll be
// a JSON.stringify away (which _will_ be significantly slower)
export const getASTCached = memoize(getAST);

export function clearCache() {
  memoizeClear(getASTCached);
}

export default {
  getASTFromSource,
  getASTCached,
  clearCache,
};
