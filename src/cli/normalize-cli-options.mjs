import { accessSync, R_OK } from "node:fs";
import { isAbsolute } from "node:path";
import set from "lodash/set.js";
import {
  RULES_FILE_NAME_SEARCH_ARRAY,
  DEFAULT_BASELINE_FILE_NAME,
  OUTPUT_TO,
  OUTPUT_TYPE,
  WEBPACK_CONFIG,
  TYPESCRIPT_CONFIG,
  BABEL_CONFIG,
  OLD_DEFAULT_RULES_FILE_NAME,
} from "./defaults.mjs";
import loadConfig from "#config-utl/extract-depcruise-config/index.mjs";

function getOptionValue(pDefault) {
  return (pValue) => (typeof pValue === "string" ? pValue : pDefault);
}

function normalizeConfigFileName(pCliOptions, pConfigWrapperName, pDefault) {
  let lOptions = structuredClone(pCliOptions);

  if (Object.hasOwn(lOptions, pConfigWrapperName)) {
    set(
      lOptions,
      `ruleSet.options.${pConfigWrapperName}.fileName`,
      getOptionValue(pDefault)(lOptions[pConfigWrapperName]),
      /* eslint security/detect-object-injection: 0 */
    );
    Reflect.deleteProperty(lOptions, pConfigWrapperName);
  }

  if (
    (lOptions?.ruleSet?.options?.[pConfigWrapperName] ?? null) &&
    !(lOptions?.ruleSet?.options?.[pConfigWrapperName]?.fileName ?? null)
  ) {
    set(lOptions, `ruleSet.options.${pConfigWrapperName}.fileName`, pDefault);
  }

  return lOptions;
}

function fileExists(pFileName) {
  try {
    accessSync(pFileName, R_OK);
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
      `Can't open config file '${pValidate}' for reading. Does it exist?\n` +
        `         - You can create a config file by running 'npx dependency-cruiser --init'\n` +
        `         - If you intended to run without a config file use --no-config\n`,
    );
  }
  return lReturnValue;
}

function validateAndGetDefaultRulesFileName() {
  let lReturnValue = RULES_FILE_NAME_SEARCH_ARRAY.find(fileExists);

  if (typeof lReturnValue === "undefined") {
    throw new TypeError(
      `Can't open a config file (.dependency-cruiser.(c)js) at the default location. Does it exist?\n` +
        `         - You can create one by running 'npx dependency-cruiser --init'\n` +
        `         - Want to run a without a config file? Use --no-config\n`,
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
      : DEFAULT_BASELINE_FILE_NAME;

  if (fileExists(lKnownViolationsFileName)) {
    return lKnownViolationsFileName;
  } else {
    throw new Error(
      `Can't open '${lKnownViolationsFileName}' for reading. Does it exist?\n` +
        `         (You can create a .dependency-cruiser-known-violations.json with --output-type baseline)\n`,
    );
  }
}

function normalizeKnownViolationsOption(pCliOptions) {
  if (
    !Object.hasOwn(pCliOptions, "ignoreKnown") ||
    pCliOptions.ignoreKnown === false
  ) {
    return {};
  }
  return {
    knownViolationsFile: validateAndGetKnownViolationsFileName(
      pCliOptions.ignoreKnown,
    ),
  };
}

async function normalizeValidationOption(pCliOptions) {
  if (!pCliOptions.validate) {
    return {
      validate: false,
    };
  }
  const rulesFile = validateAndNormalizeRulesFileName(pCliOptions.validate);
  return {
    rulesFile,
    ruleSet: await loadConfig(
      isAbsolute(rulesFile) ? rulesFile : `./${rulesFile}`,
    ),
    validate: true,
  };
}

function normalizeProgress(pCliOptions) {
  if (!Object.hasOwn(pCliOptions, "progress")) {
    return {};
  }

  let lProgress = pCliOptions.progress;
  if (lProgress === true) {
    lProgress = "cli-feedback";
  }
  return { progress: lProgress };
}

function normalizeCacheStrategy(pCliOptions) {
  if (!Object.hasOwn(pCliOptions, "cacheStrategy")) {
    return {};
  }
  const lStrategy =
    pCliOptions.cacheStrategy === "content" ? "content" : "metadata";

  let lReturnValue = {};

  if (pCliOptions.cache && typeof pCliOptions.cache === "object") {
    lReturnValue.cache = structuredClone(pCliOptions.cache);
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
  if (!Object.hasOwn(pCliOptions, "cache")) {
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
export default async function normalizeOptions(pOptionsAsPassedFromCommander) {
  let lOptions = {
    outputTo: OUTPUT_TO,
    outputType: OUTPUT_TYPE,
    ...pOptionsAsPassedFromCommander,
  };

  if (Object.hasOwn(lOptions, "moduleSystems")) {
    lOptions.moduleSystems = lOptions.moduleSystems
      .split(",")
      .map((pString) => pString.trim());
  }

  if (Object.hasOwn(lOptions, "config")) {
    lOptions.validate = lOptions.config;
  }

  lOptions = { ...lOptions, ...(await normalizeValidationOption(lOptions)) };
  lOptions = { ...lOptions, ...normalizeProgress(lOptions) };
  lOptions = { ...lOptions, ...normalizeCache(lOptions) };
  lOptions = { ...lOptions, ...normalizeCacheStrategy(lOptions) };
  lOptions = { ...lOptions, ...normalizeKnownViolationsOption(lOptions) };
  lOptions = normalizeConfigFileName(lOptions, "webpackConfig", WEBPACK_CONFIG);
  lOptions = normalizeConfigFileName(lOptions, "tsConfig", TYPESCRIPT_CONFIG);
  lOptions = normalizeConfigFileName(lOptions, "babelConfig", BABEL_CONFIG);

  return lOptions;
}

export const determineRulesFileName = getOptionValue(
  OLD_DEFAULT_RULES_FILE_NAME,
);
