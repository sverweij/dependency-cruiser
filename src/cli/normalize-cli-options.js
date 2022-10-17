const fs = require("fs");
const path = require("path");
const set = require("lodash/set");
const get = require("lodash/get");
const has = require("lodash/has");
const clone = require("lodash/clone");
const loadConfig = require("../config-utl/extract-depcruise-config");
const defaults = require("./defaults");

function getOptionValue(pDefault) {
  return (pValue) => {
    let lReturnValue = pDefault;

    if (typeof pValue === "string") {
      lReturnValue = pValue;
    }
    return lReturnValue;
  };
}

function normalizeConfigFileName(pCliOptions, pConfigWrapperName, pDefault) {
  let lOptions = clone(pCliOptions);

  if (has(lOptions, pConfigWrapperName)) {
    set(
      lOptions,
      `ruleSet.options.${pConfigWrapperName}.fileName`,
      getOptionValue(pDefault)(lOptions[pConfigWrapperName])
      /* eslint security/detect-object-injection: 0 */
    );
    Reflect.deleteProperty(lOptions, pConfigWrapperName);
  }

  if (
    get(lOptions, `ruleSet.options.${pConfigWrapperName}`, null) &&
    !get(lOptions, `ruleSet.options.${pConfigWrapperName}.fileName`, null)
  ) {
    set(lOptions, `ruleSet.options.${pConfigWrapperName}.fileName`, pDefault);
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
      `Can't open '${defaults.DEFAULT_CONFIG_FILE_NAME}(on)' for reading. Does it exist?\n`
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

function validateAndGetKnownViolationsFileName(pKnownViolations) {
  const lKnownViolationsFileName =
    typeof pKnownViolations === "string"
      ? pKnownViolations
      : defaults.DEFAULT_BASELINE_FILE_NAME;

  if (fileExists(lKnownViolationsFileName)) {
    return lKnownViolationsFileName;
  } else {
    throw new Error(
      `Can't open '${lKnownViolationsFileName}' for reading. Does it exist?\n` +
        `         (You can create a .dependency-cruiser-known-violations.json with --output-type baseline)\n`
    );
  }
}

function normalizeKnownViolationsOption(pCliOptions) {
  if (has(pCliOptions, "ignoreKnown")) {
    const lReturnValue = {
      knownViolationsFile: validateAndGetKnownViolationsFileName(
        pCliOptions.ignoreKnown
      ),
    };
    return lReturnValue;
  }
  return {};
}

function normalizeValidationOption(pCliOptions) {
  if (has(pCliOptions, "validate")) {
    const rulesFile = validateAndNormalizeRulesFileName(pCliOptions.validate);
    return {
      rulesFile,
      ruleSet: loadConfig(
        path.isAbsolute(rulesFile) ? rulesFile : `./${rulesFile}`
      ),
      validate: true,
    };
  } else {
    return {
      validate: false,
    };
  }
}

function normalizeProgress(pCliOptions) {
  let lProgress = null;

  if (has(pCliOptions, "progress")) {
    lProgress = get(pCliOptions, "progress");
    if (lProgress === true) {
      lProgress = "cli-feedback";
    }
  }
  return lProgress ? { progress: lProgress } : {};
}

function normalizeCacheFolderName(pCliOptions) {
  const lCache = get(pCliOptions, "cache", false);
  let lReturnValue = clone(pCliOptions);

  if (lCache === true) {
    lReturnValue = {
      ...lReturnValue,
      cache: defaults.CACHE_FOLDER,
    };
  }
  return lReturnValue;
}

/**
 * returns the pOptionsAsPassedFromCommander, so that the returned value contains a
 * valid value for each possible option
 *
 * @param  {object} pOptionsAsPassedFromCommander [description]
 * @param {any} pKnownCliOptions [description]
 * @return {object}          [description]
 */
module.exports = function normalizeOptions(pOptionsAsPassedFromCommander) {
  let lOptions = {
    outputTo: defaults.OUTPUT_TO,
    outputType: defaults.OUTPUT_TYPE,
    ...pOptionsAsPassedFromCommander,
    // ...ejectNonCLIOptions(pOptionsAsPassedFromCommander, pKnownCliOptions),
  };

  if (has(lOptions, "moduleSystems")) {
    lOptions.moduleSystems = lOptions.moduleSystems
      .split(",")
      .map((pString) => pString.trim());
  }

  if (has(lOptions, "config")) {
    lOptions.validate = lOptions.config;
  }

  lOptions = { ...lOptions, ...normalizeValidationOption(lOptions) };
  lOptions = { ...lOptions, ...normalizeProgress(lOptions) };
  lOptions = { ...lOptions, ...normalizeKnownViolationsOption(lOptions) };
  lOptions = normalizeCacheFolderName(lOptions);
  lOptions = normalizeConfigFileName(
    lOptions,
    "webpackConfig",
    defaults.WEBPACK_CONFIG
  );
  lOptions = normalizeConfigFileName(
    lOptions,
    "tsConfig",
    defaults.TYPESCRIPT_CONFIG
  );
  lOptions = normalizeConfigFileName(
    lOptions,
    "babelConfig",
    defaults.BABEL_CONFIG
  );

  return lOptions;
};

module.exports.determineRulesFileName = getOptionValue(
  defaults.OLD_DEFAULT_RULES_FILE_NAME
);
