const fs = require("fs");
const path = require("path");
const set = require("lodash/set");
const get = require("lodash/get");
const has = require("lodash/has");
const clone = require("lodash/clone");
const loadConfig = require("../config-utl/extract-depcruise-config");
const defaults = require("./defaults");

function getOptionValue(pDefault) {
  return (pValue) => (typeof pValue === "string" ? pValue : pDefault);
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
  if (!has(pCliOptions, "ignoreKnown") || pCliOptions.ignoreKnown === false) {
    return {};
  }
  return {
    knownViolationsFile: validateAndGetKnownViolationsFileName(
      pCliOptions.ignoreKnown
    ),
  };
}

function normalizeValidationOption(pCliOptions) {
  if (!pCliOptions.validate) {
    return {
      validate: false,
    };
  }
  const rulesFile = validateAndNormalizeRulesFileName(pCliOptions.validate);
  return {
    rulesFile,
    ruleSet: loadConfig(
      path.isAbsolute(rulesFile) ? rulesFile : `./${rulesFile}`
    ),
    validate: true,
  };
}

function normalizeProgress(pCliOptions) {
  if (!has(pCliOptions, "progress")) {
    return {};
  }

  let lProgress = pCliOptions.progress;
  if (lProgress === true) {
    lProgress = "cli-feedback";
  }
  return { progress: lProgress };
}

function normalizeCacheStrategy(pCliOptions) {
  if (!has(pCliOptions, "cacheStrategy")) {
    return {};
  }
  const lStrategy =
    pCliOptions.cacheStrategy === "content" ? "content" : "metadata";

  let lReturnValue = {};

  if (pCliOptions.cache && typeof pCliOptions.cache === "object") {
    lReturnValue.cache = clone(pCliOptions.cache);
    lReturnValue.cache.strategy = lStrategy;
  } else {
    lReturnValue = {
      cache: {
        strategy: lStrategy,
      },
    };
  }
  return lReturnValue;
}

function normalizeCache(pCliOptions) {
  if (!has(pCliOptions, "cache")) {
    return {};
  }

  if (pCliOptions.cache === true) {
    return { cache: {} };
  }

  if (typeof pCliOptions.cache === "string") {
    return {
      cache: {
        folder: pCliOptions.cache,
      },
    };
  }

  return { cache: false };
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
  lOptions = { ...lOptions, ...normalizeCache(lOptions) };
  lOptions = { ...lOptions, ...normalizeCacheStrategy(lOptions) };
  lOptions = { ...lOptions, ...normalizeKnownViolationsOption(lOptions) };
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
