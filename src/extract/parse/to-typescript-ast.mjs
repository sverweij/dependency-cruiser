import { readFileSync } from "node:fs";
import tryImport from "semver-try-require";
import memoize, { memoizeClear } from "memoize";
import transpile from "../transpile/index.mjs";
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
  if (pFileRecord.extension === ".vue") {
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

export const getASTCached = memoize(getAST);

export function clearCache() {
  memoizeClear(getASTCached);
}

export default {
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
