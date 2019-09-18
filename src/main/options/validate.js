const _get = require("lodash/get");
const safeRegex = require("../../utl/safe-regex");
const report = require("../../report");

const MODULE_SYSTEM_LIST_RE = /^((cjs|amd|es6|tsd)(,|$))+$/gi;
const VALID_DEPTH_RE = /^[0-9]{1,2}$/g;

function validateSystems(pModuleSystems) {
  if (Boolean(pModuleSystems) && Array.isArray(pModuleSystems)) {
    if (
      !pModuleSystems.every(pModuleSystem =>
        Boolean(pModuleSystem.match(MODULE_SYSTEM_LIST_RE))
      )
    ) {
      throw Error(
        `Invalid module system list: '${pModuleSystems.join(", ")}'\n`
      );
    }
  }
}

function validateRegExpSafety(pPattern) {
  if (Boolean(pPattern) && !safeRegex(pPattern)) {
    throw Error(
      `The pattern '${pPattern}' will probably run very slowly - cowardly refusing to run.\n`
    );
  }
}

function validateOutputType(pOutputType) {
  if (
    Boolean(pOutputType) &&
    !report.getAvailableReporters().includes(pOutputType)
  ) {
    throw Error(`'${pOutputType}' is not a valid output type.\n`);
  }
}

function validateMaxDepth(pDepth) {
  if (Boolean(pDepth) && !pDepth.toString().match(VALID_DEPTH_RE)) {
    throw Error(
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

function validate(pOptions) {
  let lRetval = {};

  if (Boolean(pOptions)) {
    // neccessary because can slip through the cracks when passed as a cli parameter
    validateSystems(pOptions.moduleSystems);

    // neccessary because this safety check can't be done in json schema (a.f.a.i.k.)
    validatePathsSafety(pOptions.doNotFollow);
    validatePathsSafety(pOptions.exclude);
    validateRegExpSafety(pOptions.includeOnly);

    // necessary because not in the config schema
    validateOutputType(pOptions.outputType);

    // neccessary because not found a way to do this properly in JSON schema
    validateMaxDepth(pOptions.maxDepth);

    if (_get(pOptions, "ruleSet.options")) {
      lRetval = validate(pOptions.ruleSet.options);
    }
    return { ...lRetval, ...pOptions };
  }
  return lRetval;
}

module.exports = validate;

module.exports.validateOutputType = validateOutputType;
