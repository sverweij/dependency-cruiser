const fs = require("fs");
const path = require("path");
const _set = require("lodash/set");
const _get = require("lodash/get");
const _clone = require("lodash/clone");
const compileConfig = require("./compile-config");
const defaults = require("./defaults.json");

const KNOWN_CLI_OPTIONS = [
  "baseDir",
  "config",
  "doNotFollow",
  "exclude",
  "help",
  "includeOnly",
  "info",
  "init",
  "maxDepth",
  "moduleSystems",
  "outputTo",
  "outputType",
  "prefix",
  "preserveSymlinks",
  "tsPreCompilationDeps",
  "tsConfig",
  "validate",
  "version",
  "webpackConfig",
];

function getOptionValue(pDefault) {
  return (pValue) => {
    let lReturnValue = pDefault;

    if (typeof pValue === "string") {
      lReturnValue = pValue;
    }
    return lReturnValue;
  };
}

function isKnownCLIOption(pCandidateString) {
  return KNOWN_CLI_OPTIONS.some((pString) => pString === pCandidateString);
}

/**
 * Remove all attributes from the input object (which'd typically be
 * originating from commander) that are not functional dependency-cruiser
 * options so a clean object can be passed through to the main function
 *
 * @param {any} pOptions - an options object e.g. as output from commander
 * @returns {ICruiseOptions} - an options object that only contains stuff we care about
 */
function ejectNonCLIOptions(pOptions) {
  return Object.keys(pOptions)
    .filter(isKnownCLIOption)
    .reduce((pAll, pKey) => {
      pAll[pKey] = pOptions[pKey];
      return pAll;
    }, {});
}

function normalizeConfigFile(pOptions, pConfigWrapperName, pDefault) {
  let lOptions = _clone(pOptions);

  if (Object.prototype.hasOwnProperty.call(lOptions, pConfigWrapperName)) {
    _set(
      lOptions,
      `ruleSet.options.${pConfigWrapperName}.fileName`,
      getOptionValue(pDefault)(lOptions[pConfigWrapperName])
      /* eslint security/detect-object-injection: 0 */
    );
    Reflect.deleteProperty(lOptions, pConfigWrapperName);
  }

  if (_get(lOptions, `ruleSet.options.${pConfigWrapperName}`, null)) {
    if (
      !_get(lOptions, `ruleSet.options.${pConfigWrapperName}.fileName`, null)
    ) {
      _set(
        lOptions,
        `ruleSet.options.${pConfigWrapperName}.fileName`,
        pDefault
      );
    }
  }

  return lOptions;
}

function fileExists(pFileName) {
  try {
    fs.accessSync(pFileName, fs.R_OK);
    return true;
  } catch (pError) {
    return false;
  }
}

function validateAndGetCustomRulesFileName(pValidate) {
  let lReturnValue = "";

  if (fileExists(pValidate)) {
    lReturnValue = pValidate;
  } else {
    throw new Error(
      `Can't open '${pValidate}' for reading. Does it exist?` +
        ` (You can create a dependency-cruiser configuration file with depcruise --init .)\n`
    );
  }
  return lReturnValue;
}

function validateAndGetDefaultRulesFileName() {
  let lReturnValue = defaults.RULES_FILE_NAME_SEARCH_ARRAY.find(fileExists);

  if (typeof lReturnValue === "undefined") {
    throw new TypeError(
      `Can't open '${defaults.RULES_FILE_NAME}' for reading. Does it exist?\n`
    );
  }
  return lReturnValue;
}

function validateAndNormalizeRulesFileName(pValidate) {
  let lReturnValue = "";

  if (typeof pValidate === "string") {
    lReturnValue = validateAndGetCustomRulesFileName(pValidate);
  } else {
    lReturnValue = validateAndGetDefaultRulesFileName();
  }

  return lReturnValue;
}

/**
 * returns the pOptions, so that the returned value contains a
 * valid value for each possible option
 *
 * @param  {object} pOptionsAsPassedFromCommander [description]
 * @return {object}          [description]
 */
module.exports = (pOptionsAsPassedFromCommander) => {
  let lOptions = {
    outputTo: defaults.OUTPUT_TO,
    outputType: defaults.OUTPUT_TYPE,
    ...ejectNonCLIOptions(pOptionsAsPassedFromCommander),
  };

  if (Object.prototype.hasOwnProperty.call(lOptions, "moduleSystems")) {
    lOptions.moduleSystems = lOptions.moduleSystems
      .split(",")
      .map((pString) => pString.trim());
  }

  if (Object.prototype.hasOwnProperty.call(lOptions, "config")) {
    lOptions.validate = lOptions.config;
  }

  if (Object.prototype.hasOwnProperty.call(lOptions, "validate")) {
    lOptions.rulesFile = validateAndNormalizeRulesFileName(lOptions.validate);
    lOptions.ruleSet = compileConfig(
      path.isAbsolute(lOptions.rulesFile)
        ? lOptions.rulesFile
        : `./${lOptions.rulesFile}`
    );
    lOptions.validate = true;
  }

  lOptions = normalizeConfigFile(
    lOptions,
    "webpackConfig",
    defaults.WEBPACK_CONFIG
  );
  lOptions = normalizeConfigFile(
    lOptions,
    "tsConfig",
    defaults.TYPESCRIPT_CONFIG
  );

  lOptions.validate = Object.prototype.hasOwnProperty.call(
    lOptions,
    "validate"
  );

  return lOptions;
};

module.exports.determineRulesFileName = getOptionValue(
  defaults.RULES_FILE_NAME
);
