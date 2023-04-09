import has from "lodash/has.js";
import merge from "lodash/merge.js";
import safeRegex from "safe-regex";
import report from "../../report/index.mjs";

const MODULE_SYSTEM_LIST_RE = /^((cjs|amd|es6|tsd)(,|$))+$/gi;
const VALID_DEPTH_RE = /^\d{1,2}$/g;

function validateSystems(pModuleSystems) {
  if (
    Boolean(pModuleSystems) &&
    Array.isArray(pModuleSystems) &&
    !pModuleSystems.every((pModuleSystem) =>
      Boolean(pModuleSystem.match(MODULE_SYSTEM_LIST_RE))
    )
  ) {
    throw new Error(
      `Invalid module system list: '${pModuleSystems.join(", ")}'\n`
    );
  }
}

function validateRegExpSafety(pPattern) {
  if (Boolean(pPattern) && !safeRegex(pPattern)) {
    throw new Error(
      `The pattern '${pPattern}' will probably run very slowly - cowardly refusing to run.\n`
    );
  }
}

function validateOutputType(pOutputType) {
  if (
    Boolean(pOutputType) &&
    !report.getAvailableReporters().includes(pOutputType) &&
    !pOutputType.startsWith("plugin:")
  ) {
    throw new Error(`'${pOutputType}' is not a valid output type.\n`);
  }
}

function validateMaxDepth(pDepth) {
  if (Boolean(pDepth) && !pDepth.toString().match(VALID_DEPTH_RE)) {
    throw new Error(
      `'${pDepth}' is not a valid depth - use an integer between 0 and 99`
    );
  }
}

function validateFocusDepth(pFocusDepth) {
  const lFocusDepth = Number.parseInt(pFocusDepth, 10);
  const lMaxFocusDepth = 99;

  if (
    Boolean(pFocusDepth) &&
    (Number.isNaN(lFocusDepth) ||
      lFocusDepth < 0 ||
      lFocusDepth > lMaxFocusDepth)
  ) {
    throw new Error(
      `'${pFocusDepth}' is not a valid focus depth - use an integer between 0 and ${lMaxFocusDepth}`
    );
  }
}

function validatePathsSafety(pFilterOption) {
  if (typeof pFilterOption === "string") {
    validateRegExpSafety(pFilterOption);
  }

  validateRegExpSafety(pFilterOption?.path ?? "");
  validateRegExpSafety(pFilterOption?.pathNot ?? "");
}

/**
 * @param {any} pOptions
 * @throws {Error}
 * @returns {import("../../../types/dependency-cruiser.js").ICruiseOptions}
 */
export function validateCruiseOptions(pOptions) {
  let lReturnValue = {};

  if (Boolean(pOptions)) {
    // necessary because can slip through the cracks when passed as a cli parameter
    validateSystems(pOptions.moduleSystems);

    // necessary because this safety check can't be done in json schema (a.f.a.i.k.)
    validatePathsSafety(pOptions.doNotFollow);
    validatePathsSafety(pOptions.exclude);
    validateRegExpSafety(pOptions.includeOnly);
    validateRegExpSafety(pOptions.focus);
    validateRegExpSafety(pOptions.reaches);
    validateRegExpSafety(pOptions.highlight);
    validateRegExpSafety(pOptions.collapse);

    // necessary because not in the config schema
    validateOutputType(pOptions.outputType);

    // necessary because not found a way to do this properly in JSON schema
    validateMaxDepth(pOptions.maxDepth);

    validateFocusDepth(pOptions.focusDepth);

    if (has(pOptions, "ruleSet.options")) {
      lReturnValue = validateCruiseOptions(pOptions.ruleSet.options);
    }
    return merge({}, lReturnValue, pOptions);
  }
  return lReturnValue;
}

/**
 *
 * @param {import("../../../types/dependency-cruiser.js").IFormatOptions} pFormatOptions
 * @throws {Error}
 */
export function validateFormatOptions(pFormatOptions) {
  validatePathsSafety(pFormatOptions.exclude);
  validatePathsSafety(pFormatOptions.focus);
  validatePathsSafety(pFormatOptions.reaches);
  validatePathsSafety(pFormatOptions.includeOnly);
  validateRegExpSafety(pFormatOptions.collapse);
  validateOutputType(pFormatOptions.outputType);
  validateFocusDepth(pFormatOptions.focusDepth);
}
