import merge from "lodash/merge.js";
import safeRegex from "safe-regex";
import report from "#report/index.mjs";

const MODULE_SYSTEM_LIST_RE = /^(?:(?:cjs|amd|es6|tsd)(?:,|$)){1,4}/gi;
const VALID_DEPTH_RE = /^\d{1,2}$/g;

function assertModuleSystemsValid(pModuleSystems) {
  if (
    Boolean(pModuleSystems) &&
    Array.isArray(pModuleSystems) &&
    !pModuleSystems.every((pModuleSystem) =>
      Boolean(pModuleSystem.match(MODULE_SYSTEM_LIST_RE)),
    )
  ) {
    throw new Error(
      `Invalid module system list: '${pModuleSystems.join(", ")}'\n`,
    );
  }
}

function assertRegExpSafety(pPattern) {
  if (Boolean(pPattern) && !safeRegex(pPattern)) {
    throw new Error(
      `The pattern '${pPattern}' will probably run very slowly - cowardly refusing to run.\n`,
    );
  }
}

function assertOutputTypeValid(pOutputType) {
  if (
    Boolean(pOutputType) &&
    !report.getAvailableReporters().includes(pOutputType) &&
    !pOutputType.startsWith("plugin:")
  ) {
    throw new Error(`'${pOutputType}' is not a valid output type.\n`);
  }
}

function assertMaxDepthValid(pDepth) {
  if (Boolean(pDepth) && !pDepth.toString().match(VALID_DEPTH_RE)) {
    throw new Error(
      `'${pDepth}' is not a valid depth - use an integer between 0 and 99`,
    );
  }
}

function assertFocusDepthValid(pFocusDepth) {
  const lFocusDepth = Number.parseInt(pFocusDepth, 10);
  const lMaxFocusDepth = 99;

  if (
    Boolean(pFocusDepth) &&
    (Number.isNaN(lFocusDepth) ||
      lFocusDepth < 0 ||
      lFocusDepth > lMaxFocusDepth)
  ) {
    throw new Error(
      `'${pFocusDepth}' is not a valid focus depth - use an integer between 0 and ${lMaxFocusDepth}`,
    );
  }
}

function assertPathsSafety(pFilterOption) {
  if (typeof pFilterOption === "string") {
    assertRegExpSafety(pFilterOption);
  }

  assertRegExpSafety(pFilterOption?.path ?? "");
  assertRegExpSafety(pFilterOption?.pathNot ?? "");
}

/**
 * @param {any} pOptions
 * @throws {Error}
 * @returns {import("../../../types/dependency-cruiser.js").ICruiseOptions}
 */
export function assertCruiseOptionsValid(pOptions) {
  let lReturnValue = {};

  if (Boolean(pOptions)) {
    // necessary because can slip through the cracks when passed as a cli parameter
    assertModuleSystemsValid(pOptions.moduleSystems);

    // necessary because this safety check can't be done in json schema (a.f.a.i.k.)
    assertPathsSafety(pOptions.doNotFollow);
    assertPathsSafety(pOptions.exclude);
    assertRegExpSafety(pOptions.includeOnly);
    assertRegExpSafety(pOptions.focus);
    assertRegExpSafety(pOptions.reaches);
    assertRegExpSafety(pOptions.highlight);
    assertRegExpSafety(pOptions.collapse);

    // necessary because not in the config schema
    assertOutputTypeValid(pOptions.outputType);

    // necessary because not found a way to do this properly in JSON schema
    assertMaxDepthValid(pOptions.maxDepth);

    assertFocusDepthValid(pOptions.focusDepth);

    if (pOptions?.ruleSet?.options) {
      lReturnValue = assertCruiseOptionsValid(pOptions.ruleSet.options);
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
export function assertFormatOptionsValid(pFormatOptions) {
  assertPathsSafety(pFormatOptions.exclude);
  assertPathsSafety(pFormatOptions.focus);
  assertPathsSafety(pFormatOptions.reaches);
  assertPathsSafety(pFormatOptions.includeOnly);
  assertRegExpSafety(pFormatOptions.collapse);
  assertOutputTypeValid(pFormatOptions.outputType);
  assertFocusDepthValid(pFormatOptions.focusDepth);
}
