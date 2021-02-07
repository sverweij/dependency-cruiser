const _get = require("lodash/get");
const _has = require("lodash/has");
const safeRegex = require("safe-regex");
const report = require("../../report");

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

function validatePathsSafety(pFilterOption) {
  if (typeof pFilterOption === "string") {
    validateRegExpSafety(pFilterOption);
  }

  validateRegExpSafety(_get(pFilterOption, "path", ""));
  validateRegExpSafety(_get(pFilterOption, "pathNot", ""));
}

function validateCruiseOptions(pOptions) {
  let lReturnValue = {};

  if (Boolean(pOptions)) {
    // neccessary because can slip through the cracks when passed as a cli parameter
    validateSystems(pOptions.moduleSystems);

    // neccessary because this safety check can't be done in json schema (a.f.a.i.k.)
    validatePathsSafety(pOptions.doNotFollow);
    validatePathsSafety(pOptions.exclude);
    validateRegExpSafety(pOptions.includeOnly);
    validateRegExpSafety(pOptions.focus);
    validateRegExpSafety(pOptions.collapse);

    // necessary because not in the config schema
    validateOutputType(pOptions.outputType);

    // neccessary because not found a way to do this properly in JSON schema
    validateMaxDepth(pOptions.maxDepth);

    if (_has(pOptions, "ruleSet.options")) {
      lReturnValue = validateCruiseOptions(pOptions.ruleSet.options);
    }
    return { ...lReturnValue, ...pOptions };
  }
  return lReturnValue;
}

function validateFormatOptions(pFormatOptions) {
  validatePathsSafety(pFormatOptions.exclude);
  validatePathsSafety(pFormatOptions.focus);
  validatePathsSafety(pFormatOptions.includeOnly);
  validateRegExpSafety(pFormatOptions.collapse);
  validateOutputType(pFormatOptions.outputType);
}

module.exports = {
  validateCruiseOptions,
  validateFormatOptions,
};
