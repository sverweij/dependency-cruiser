/* eslint-disable import/max-dependencies */
import { join } from "path";
import { glob } from "glob";
import cloneDeep from "lodash/cloneDeep.js";
import set from "lodash/set.js";
import isInstalledGlobally from "is-installed-globally";
import chalk from "chalk";

import { cruise } from "../main/index.mjs";
import bus from "../utl/bus.js";

import extractTSConfig from "../config-utl/extract-ts-config.mjs";
import extractBabelConfig from "../config-utl/extract-babel-config.mjs";
import extractWebpackResolveConfig from "../config-utl/extract-webpack-resolve-config.mjs";
import extractKnownViolations from "../config-utl/extract-known-violations.mjs";
import busLogLevels from "../utl/bus-log-levels.js";
import validateFileExistence from "./utl/validate-file-existence.mjs";
import normalizeCliOptions from "./normalize-cli-options.mjs";
import { write } from "./utl/io.mjs";
import formatMetaInfo from "./format-meta-info.mjs";
import setUpCliFeedbackListener from "./listeners/cli-feedback.mjs";
import setUpPerformanceLogListener from "./listeners/performance-log/index.mjs";
import setUpNDJSONListener from "./listeners/ndjson.mjs";
import initConfig from "./init-config/index.mjs";

function extractResolveOptions(pCruiseOptions) {
  let lResolveOptions = {};
  const lWebPackConfigFileName =
    pCruiseOptions?.ruleSet?.options?.webpackConfig?.fileName ?? null;

  if (lWebPackConfigFileName) {
    lResolveOptions = extractWebpackResolveConfig(
      lWebPackConfigFileName,
      pCruiseOptions?.ruleSet?.options?.webpackConfig?.env ?? null,
      pCruiseOptions?.ruleSet?.options?.webpackConfig?.arguments ?? null
    );
  }
  return lResolveOptions;
}

function addKnownViolations(pCruiseOptions) {
  if (pCruiseOptions.knownViolationsFile) {
    const lKnownViolations = extractKnownViolations(
      pCruiseOptions.knownViolationsFile
    );

    // Check against json schema is already done in src/main/options/validate
    // so here we can just concentrate on the io
    let lCruiseOptions = cloneDeep(pCruiseOptions);
    set(lCruiseOptions, "ruleSet.options.knownViolations", lKnownViolations);
    return lCruiseOptions;
  }
  return pCruiseOptions;
}

function extractTSConfigOptions(pCruiseOptions) {
  let lReturnValue = {};
  const lTSConfigFileName =
    pCruiseOptions?.ruleSet?.options?.tsConfig?.fileName ?? null;

  if (lTSConfigFileName) {
    lReturnValue = extractTSConfig(lTSConfigFileName);
  }

  return lReturnValue;
}

function extractBabelConfigOptions(pCruiseOptions) {
  let lReturnValue = {};
  const lBabelConfigFileName =
    pCruiseOptions?.ruleSet?.options?.babelConfig?.fileName ?? null;

  if (lBabelConfigFileName) {
    lReturnValue = extractBabelConfig(lBabelConfigFileName);
  }

  return lReturnValue;
}

function setUpListener(pCruiseOptions) {
  const lString2Listener = {
    "cli-feedback": setUpCliFeedbackListener,
    "performance-log": setUpPerformanceLogListener,
    ndjson: setUpNDJSONListener,
  };
  const lListenerID =
    pCruiseOptions?.progress ??
    pCruiseOptions?.ruleSet?.options?.progress?.type;
  // eslint-disable-next-line security/detect-object-injection
  const lListenerFunction = lString2Listener?.[lListenerID];
  /* c8 ignore next 6 */
  if (Boolean(lListenerFunction)) {
    lListenerFunction(
      bus,
      pCruiseOptions?.ruleSet?.options?.progress?.maximumLevel ??
        busLogLevels.INFO
    );
  }
}

async function runCruise(pFileDirectoryArray, pCruiseOptions) {
  const lCruiseOptions = addKnownViolations(
    await normalizeCliOptions(pCruiseOptions)
  );

  pFileDirectoryArray
    .filter((pFileOrDirectory) => !glob.hasMagic(pFileOrDirectory))
    .map((pFileOrDirectory) =>
      lCruiseOptions?.ruleSet?.options?.baseDir
        ? join(lCruiseOptions.ruleSet.options.baseDir, pFileOrDirectory)
        : pFileOrDirectory
    )
    .forEach(validateFileExistence);

  setUpListener(lCruiseOptions);

  bus.emit("start");
  const lReportingResult = await cruise(
    pFileDirectoryArray,
    lCruiseOptions,
    extractResolveOptions(lCruiseOptions),
    {
      tsConfig: extractTSConfigOptions(lCruiseOptions),
      babelConfig: await extractBabelConfigOptions(lCruiseOptions),
    }
  );

  bus.emit("progress", "cli: writing results", { complete: 1 });
  bus.emit("write-start");
  write(lCruiseOptions.outputTo, lReportingResult.output);

  return lReportingResult.exitCode;
}

/**
 *
 * @param {string[]} pFileDirectoryArray
 * @param {import("../../types/options").ICruiseOptions} lCruiseOptions
 * @returns {number}
 */
export default async function executeCli(pFileDirectoryArray, pCruiseOptions) {
  let lCruiseOptions = pCruiseOptions || {};
  let lExitCode = 0;

  try {
    /* c8 ignore start */
    if (isInstalledGlobally) {
      process.stderr.write(
        `\n  ${chalk.yellow(
          "WARNING"
        )}: You're running a globally installed dependency-cruiser.\n\n` +
          `           We recommend to ${chalk.bold.italic.underline(
            "install and run it as a local devDependency"
          )} in\n` +
          `           your project instead. There it has your project's environment and\n` +
          `           transpilers at its disposal. That will ensure it can find e.g.\n` +
          `           TypeScript, Vue or Svelte modules and dependencies.\n\n`
      );
    }
    /* c8 ignore stop */
    if (lCruiseOptions.info === true) {
      process.stdout.write(formatMetaInfo());
    } else if (lCruiseOptions.init) {
      initConfig(lCruiseOptions.init);
    } else {
      lExitCode = await runCruise(pFileDirectoryArray, lCruiseOptions);
    }
  } catch (pError) {
    process.stderr.write(`\n  ${chalk.red("ERROR")}: ${pError.message}\n`);
    bus.emit("end");
    lExitCode = 1;
  }
  bus.emit("end");
  return lExitCode;
}
