import { readFile } from "node:fs/promises";
import json5 from "json5";
import makeAbsolute from "./make-absolute.mjs";

/**
 * @typedef {import("../../types/violations.d.mjs").IViolation} IViolation
 * @typedef {import("../../types/shared-types.d.mts").DependencyType} DependencyType
 *
 * @typedef {IViolation & {cycle: Array<{name: string, dependencyTypes: Array<DependencyType>}>} | {cycle: Array<DependencyType>}} IMaybeOldFormatViolation
 */

/**
 * cycles went from Array<string> to Array<{name: string, dependencyTypes: Array<DependencyType>}>
 * in version 16.0.0. Known violations would typically be still in the old
 * format. To prevent customers from bumping into error messages and having
 * to update or regenerate their known violations, we'll make the old format
 * forward compatible with this.
 *
 * @param {IMaybeOldFormatViolation} pKnownViolation
 * @returns {IViolation}
 */
function makeForwardCompatible(pKnownViolation) {
  let lReturnValue = pKnownViolation;
  if (Boolean(pKnownViolation.cycle)) {
    lReturnValue = {
      ...pKnownViolation,
      cycle: pKnownViolation.cycle.map((pModule) => {
        if (Boolean(pModule.name)) {
          return pModule;
        }
        return {
          name: pModule,
          dependencyTypes: [],
        };
      }),
    };
  }
  if (Boolean(pKnownViolation.via)) {
    lReturnValue = {
      ...pKnownViolation,
      via: pKnownViolation.via.map((pModule) => {
        if (Boolean(pModule.name)) {
          return pModule;
        }
        return {
          name: pModule,
          dependencyTypes: [],
        };
      }),
    };
  }
  return lReturnValue;
}

export default async function extractKnownViolations(pKnownViolationsFileName) {
  try {
    const lFileContents = await readFile(
      makeAbsolute(pKnownViolationsFileName),
      "utf8",
    );
    const lKnownViolations = json5.parse(lFileContents);
    const lForwardCompatible = lKnownViolations.map(makeForwardCompatible);

    return lForwardCompatible;
  } catch (pError) {
    if (pError instanceof SyntaxError) {
      throw new SyntaxError(
        `'${pKnownViolationsFileName}' should be valid json\n          ${pError}`,
      );
    }
    throw pError;
  }

  // TODO: validate the json against the schema? (might be more clear to do it here,
  // even if (in context of the cli) it's done again when validating the whole
  // config
}
