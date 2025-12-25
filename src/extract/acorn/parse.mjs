import { readFileSync } from "node:fs";
import { Parser as acornParser, parse as acornParse } from "acorn";
import { parse as acornLooseParse } from "acorn-loose";
import acornJsx from "acorn-jsx";
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
/**@type {Map<string, acorn.Node>} */
const CACHE = new Map();

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
 * Subsequent calls for the same file name will return the result from a cache.
 *
 * @param {string} pFileName - the name of the file to compile
 * @param {any} pTranspileOptions - options for the transpiler(s) - typically a tsconfig or a babel config
 * @return {acorn.Node} - a (javascript) AST
 */
export function getASTCached(pFileName, pTranspileOptions) {
  // taking the transpile options into account of the cache key seems like
  // a good idea, but a.t.m. isn't necessary. Easy to add later if needed.
  if (CACHE.has(pFileName)) {
    return CACHE.get(pFileName);
  }
  const lAST = getASTFromSource(
    {
      source: readFileSync(pFileName, "utf8"),
      extension: getExtension(pFileName),
      filename: pFileName,
    },
    pTranspileOptions,
  );
  CACHE.set(pFileName, lAST);
  return lAST;
}

export function clearCache() {
  CACHE.clear();
}
