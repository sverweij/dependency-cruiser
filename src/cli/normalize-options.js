const fs = require("fs");
const path = require("path");
const _set = require("lodash/set");
const _get = require("lodash/get");
const _clone = require("lodash/clone");
const compileConfig = require("./compile-config");
const defaults = require("./defaults.json");

function getOptionValue(pDefault) {
  return pValue => {
    let lReturnValue = pDefault;

    if (typeof pValue === "string") {
      lReturnValue = pValue;
    }
    return lReturnValue;
  };
}

function normalizeConfigFile(pOptions, pConfigWrapperName, pDefault) {
  let lOptions = _clone(pOptions);

  if (lOptions.hasOwnProperty(pConfigWrapperName)) {
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
 * @param  {object} pOptions [description]
 * @return {object}          [description]
 */
module.exports = pOptions => {
  pOptions = {
    outputTo: defaults.OUTPUT_TO,
    outputType: defaults.OUTPUT_TYPE,
    ...pOptions
  };

  if (pOptions.hasOwnProperty("moduleSystems")) {
    pOptions.moduleSystems = pOptions.moduleSystems
      .split(",")
      .map(pString => pString.trim());
  }

  if (pOptions.hasOwnProperty("config")) {
    pOptions.validate = pOptions.config;
  }

  if (pOptions.hasOwnProperty("validate")) {
    pOptions.rulesFile = validateAndNormalizeRulesFileName(pOptions.validate);
    pOptions.ruleSet = compileConfig(
      path.isAbsolute(pOptions.rulesFile)
        ? pOptions.rulesFile
        : `./${pOptions.rulesFile}`
    );
    pOptions.validate = true;
  }

  pOptions = normalizeConfigFile(
    pOptions,
    "webpackConfig",
    defaults.WEBPACK_CONFIG
  );
  pOptions = normalizeConfigFile(
    pOptions,
    "tsConfig",
    defaults.TYPESCRIPT_CONFIG
  );

  pOptions.validate = pOptions.hasOwnProperty("validate");

  return pOptions;
};

module.exports.determineRulesFileName = getOptionValue(
  defaults.RULES_FILE_NAME
);
