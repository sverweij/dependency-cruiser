const fs = require("fs");
const path = require("path");
const _set = require("lodash/set");
const _get = require("lodash/get");
const _has = require("lodash/has");
const _clone = require("lodash/clone");
const loadConfig = require("../config-utl/extract-depcruise-config");
const defaults = require("./defaults.json");

const KNOWN_DEPCRUISE_OPTIONS = [
  "babelConfig",
  "baseDir",
  "collapse",
  "config",
  "doNotFollow",
  "exclude",
  "focus",
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
  "progress",
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

function isKnownCLIOption(pKnownOptions) {
  return (pCandidateString) => pKnownOptions.includes(pCandidateString);
}

/**
 * Remove all attributes from the input object (which'd typically be
 * originating from commander) that are not functional dependency-cruiser
 * options so a clean object can be passed through to the main function
 *
 * @param {any} pOptions - an options object e.g. as output from commander
 * @returns {ICruiseOptions} - an options object that only contains stuff we care about
 */
function ejectNonCLIOptions(pOptions, pKnownOptions) {
  return Object.keys(pOptions)
    .filter(isKnownCLIOption(pKnownOptions))
    .reduce((pAll, pKey) => {
      pAll[pKey] = pOptions[pKey];
      return pAll;
    }, {});
}

function normalizeConfigFile(pOptions, pConfigWrapperName, pDefault) {
  let lOptions = _clone(pOptions);

  if (_has(lOptions, pConfigWrapperName)) {
    _set(
      lOptions,
      `ruleSet.options.${pConfigWrapperName}.fileName`,
      getOptionValue(pDefault)(lOptions[pConfigWrapperName])
      /* eslint security/detect-object-injection: 0 */
    );
    Reflect.deleteProperty(lOptions, pConfigWrapperName);
  }

  if (
    _get(lOptions, `ruleSet.options.${pConfigWrapperName}`, null) &&
    !_get(lOptions, `ruleSet.options.${pConfigWrapperName}.fileName`, null)
  ) {
    _set(lOptions, `ruleSet.options.${pConfigWrapperName}.fileName`, pDefault);
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

function normalizeValidationOptions(pOptions) {
  if (_has(pOptions, "validate")) {
    const rulesFile = validateAndNormalizeRulesFileName(pOptions.validate);
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

function normalizeProgress(pOptions) {
  let lProgress = null;

  if (_has(pOptions, "progress")) {
    lProgress = _get(pOptions, "progress");
    if (lProgress === true) {
      lProgress = "cli-feedback";
    }
  }
  return lProgress ? { progress: lProgress } : {};
}

/**
 * returns the pOptions, so that the returned value contains a
 * valid value for each possible option
 *
 * @param  {object} pOptionsAsPassedFromCommander [description]
 * @return {object}          [description]
 */
module.exports = function normalizeOptions(
  pOptionsAsPassedFromCommander,
  pKnownOptions = KNOWN_DEPCRUISE_OPTIONS
) {
  let lOptions = {
    outputTo: defaults.OUTPUT_TO,
    outputType: defaults.OUTPUT_TYPE,
    ...ejectNonCLIOptions(pOptionsAsPassedFromCommander, pKnownOptions),
  };

  if (_has(lOptions, "moduleSystems")) {
    lOptions.moduleSystems = lOptions.moduleSystems
      .split(",")
      .map((pString) => pString.trim());
  }

  if (_has(lOptions, "config")) {
    lOptions.validate = lOptions.config;
  }

  lOptions = { ...lOptions, ...normalizeValidationOptions(lOptions) };
  lOptions = { ...lOptions, ...normalizeProgress(lOptions) };

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
  lOptions = normalizeConfigFile(
    lOptions,
    "babelConfig",
    defaults.BABEL_CONFIG
  );

  return lOptions;
};

module.exports.determineRulesFileName = getOptionValue(
  defaults.OLD_DEFAULT_RULES_FILE_NAME
);
