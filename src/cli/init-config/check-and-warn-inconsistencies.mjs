/* eslint-disable prefer-template */
/**
 * @import { IInitConfig } from "./types.mjs";
 * @import { IAvailableTranspiler } from "../../../types/dependency-cruiser.mjs"
 * @import { Writable } from "node:stream"
 */

import { EOL } from "node:os";
import { styleText } from "node:util";
import { getAvailableTranspilers } from "#extract/transpile/meta.mjs";

/**
 * returns true if
 * - typescript features are detected _and_ a typescript compiler is present
 * - no typescript features were detected
 * returns false in all other cases
 *
 * @param {IInitConfig} pInitOptions
 * @param {IAvailableTranspiler[]} pAvailableTranspilers
 * @return {boolean}
 */
function typescriptIsConsistent(pInitOptions, pAvailableTranspilers) {
  if (pInitOptions.usesTypeScript) {
    return pAvailableTranspilers.some(
      (pAvailableTranspiler) =>
        pAvailableTranspiler.name === "typescript" &&
        pAvailableTranspiler.available,
    );
  }
  return true;
}

/**
 * returns true if
 * - babel features are detected _and_ the babel transpiler is present
 * - no babel features were detected
 * returns false in all other cases
 *
 * @param {IInitConfig} pInitOptions
 * @param {IAvailableTranspiler[]} pAvailableTranspilers
 * @return {boolean}
 */
function babelIsConsistent(pInitOptions, pAvailableTranspilers) {
  if (pInitOptions.babelConfig) {
    return pAvailableTranspilers.some(
      (pAvailableTranspiler) =>
        pAvailableTranspiler.name === "babel" && pAvailableTranspiler.available,
    );
  }
  return true;
}

/**
 * Prints warnings to stderr if there's inconsistencies in the init options.
 * E.g. typescript options are used, but the (microsoft) typescript compiler
 * isn't installed.
 *
 * @param {IInitConfig} pInitOptions
 * @param {NodeJS.WritableStream} [pErrorStream]
 * @return {IInitConfig} pInitOptions
 */
export function checkAndWarnInconsistencies(
  pInitOptions,
  pErrorStream = process.stderr,
  pAvailableTranspilerFunction = getAvailableTranspilers,
) {
  const lAvailableTranspilers = pAvailableTranspilerFunction();
  const lWarningMessages = [];

  if (!typescriptIsConsistent(pInitOptions, lAvailableTranspilers)) {
    lWarningMessages.push(
      EOL +
        "   ‼ TypeScript compiler not found" +
        EOL +
        "     TypeScript features are used but the TypeScript compiler isn't installed. " +
        EOL +
        "     Install it to ensure dependency-cruiser cruises TypeScript sources e.g. by running" +
        EOL +
        EOL +
        "       npm i -D typescript" +
        EOL,
    );
  }
  if (!babelIsConsistent(pInitOptions, lAvailableTranspilers)) {
    lWarningMessages.push(
      EOL +
        "   ‼ Babel not found " +
        EOL +
        "     Babel features are used but Babel isn't installed. " +
        EOL +
        "     Install it to ensure dependency-cruiser takes them into account. E.g. by running" +
        EOL +
        EOL +
        "       npm i -D @babel/core" +
        EOL,
    );
  }

  // future features: do the same for ...
  // ... webpack
  // ... svelte
  // ... vue
  // ... coffeescript
  // ... livescript?
  if (lWarningMessages.length > 0) {
    pErrorStream.write(styleText("yellow", lWarningMessages.join("")));
  }

  // as it's used in a promise chain ...
  return pInitOptions;
}
