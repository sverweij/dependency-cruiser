import { readFileSync } from "node:fs";
import tryImport from "#utl/try-import.mjs";
import meta from "#meta.cjs";

/**
 * @import swcCore, { ParseOptions, ModuleItem } from "@swc/core";
 */

/** @type {swcCore} */
const swc = await tryImport("@swc/core", meta.supportedTranspilers.swc);

/** @type {ParseOptions} */
const SWC_PARSE_OPTIONS = {
  // deprecated in swc now - kept in to remain compatible with earlier versions of swc
  dynamicImport: true,
  // typescript is a superset of ecmascript, so we use typescript always
  syntax: "typescript",
  // target doesn't have effect on parsing it seems
  target: "es2022",
  // allow for decorators
  decorators: true,
  // no tsx by default - overridden when the extension calls for it (see getOptionsFor)
  // tsx: false
};
/** @type {Map<string, ModuleItem[]>} */
const CACHE = new Map();

/**
 * Returns the parse options necessary to have swc parse the file name
 * pFileName correctly (mainly important for jsx/ tsx)
 *
 * @param {string} pFileName
 * @returns {ParseOptions}
 */
function getOptionsFor(pFileName) {
  return /[.](?:tsx|jsx)$/.test(pFileName)
    ? { ...SWC_PARSE_OPTIONS, tsx: true }
    : SWC_PARSE_OPTIONS;
}

/**
 * Compiles the file identified by pFileName into an (swc)
 * AST and returns it. Subsequent calls for the same file name will
 * return the result from a cache
 *
 * @param {string} pFileName - the name of the file to compile
 * @returns {ModuleItem[]} - an (swc) AST
 */
export function getASTCached(pFileName) {
  if (CACHE.has(pFileName)) {
    return CACHE.get(pFileName);
  }
  try {
    /** @type {swcCore.Module} */
    const lAST = swc.parseFileSync(pFileName, getOptionsFor(pFileName));
    CACHE.set(pFileName, lAST);
    return lAST;
  } catch (swcParseException) {
    // swc doesn't handle const declarations without initialization in typescript
    // declaration files a.k.a. "ambient contexts", .d.ts etc. (Not sure
    // swc distinguishes ambient and non-ambient contexts at all).
    if (
      swcParseException?.code === "GenericFailure" &&
      /[.]d[.][cm]?ts$/.test(pFileName)
    ) {
      const lErrorMessage = swcParseException.toString();
      if (lErrorMessage.includes("'const' declarations must be initialized")) {
        // we can go about this several ways
        // - just throw the thing - halting the cruise (for actually no good reason)
        // - warn the user they could better switch to another compiler (tsc comes to mind...)
        // - make the error 'go away' with a workaround.
        //
        // We chose the last one. Swc doesn't complain about uninitialized
        // _variables_ in ambient contexts, so we globally replace each
        // `const` keyword with a `let` one. This works because const -> let
        // makes no difference for our context (plucking dependencies
        // from the AST), except in enum declarations; swc happily does compile
        // `export const enum Direction { Up, Down }`
        // The regex is more cursed than usual to allow for comments in const
        // declarations (and yes, we _did_ check for a ReDoS vulno and found none)
        const lDoctoredSrc = readFileSync(pFileName, {
          encoding: "utf8",
        }).replace(
          /(\s|[/][*][^*]*[*][/]|^)const(\s|[/][*][^*]*[*][/])+(?!enum(?:\s|[/][*][^*]*[*][/]))/gm,
          "$1let$2",
        );
        const lDoctoredAST = swc.parseSync(
          lDoctoredSrc,
          getOptionsFor(pFileName),
        );
        CACHE.set(pFileName, lDoctoredAST);
        return lDoctoredAST;
      }
    }
    throw swcParseException;
  }
}

export function clearCache() {
  CACHE.clear();
}

/**
 * @returns {boolean} - true if the swc compiler is available,
 *                     false in all other cases
 */
// @ts-expect-error dfdfd
export const isAvailable = () => swc !== false;

export const version = () => `@swc/core@${swc.version}`;
