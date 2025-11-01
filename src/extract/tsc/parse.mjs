import { readFileSync } from "node:fs";
import memoize, { memoizeClear } from "memoize";
import transpile from "../transpile/index.mjs";
import tryImport from "#utl/try-import.mjs";
import meta from "#meta.cjs";
import getExtension from "#utl/get-extension.mjs";

/** @type {import('typescript')} */
const typescript = await tryImport(
  "typescript",
  meta.supportedTranspilers.typescript,
);

/**
 * Compiles pTypescriptSource into a (typescript) AST
 *
 * @param {object} pFileRecord Record with source code, an extension and a filename
 * @param {any} [pTranspileOptions] options for the transpiler(s) - a tsconfig or
 *                                a babel config
 * @return {object} - a (typescript) AST
 */
export function getASTFromSource(pFileRecord, pTranspileOptions) {
  let lSource = pFileRecord.source;
  if (pFileRecord.extension === ".vue" || pFileRecord.extension === ".astro") {
    lSource = transpile(pFileRecord, pTranspileOptions);
  }

  return typescript.createSourceFile(
    pFileRecord.filename || "$internal-file-name",
    lSource,
    typescript.ScriptTarget.Latest,
    false,
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
      source: readFileSync(pFileName, "utf8"),
      extension: getExtension(pFileName),
      filename: pFileName,
    },
    pTranspileOptions,
  );
}

/**
 * Compiles the file identified by pFileName into a (typescript)
 * AST and returns it. Subsequent calls for the same file name will
 * return the result from a cache
 *
 * @param {string} pFileName - the name of the file to compile
 * @return {object} - a (typescript) AST
 */
export const getASTCached = memoize(getAST);

/**
 * @return {boolean} - true if the typescript compiler is available,
 *                     false in all other cases
 */
export const isAvailable = () => typescript !== false;

export function clearCache() {
  memoizeClear(getASTCached);
}
