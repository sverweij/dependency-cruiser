const glob = require("glob");
const _get = require("lodash/get");
const main = require("../main");
const bus = require("../utl/bus");

const extractTSConfig = require("../config-utl/extract-ts-config");
const extractBabelConfig = require("../config-utl/extract-babel-config");
const extractWebpackResolveConfig = require("../config-utl/extract-webpack-resolve-config");
const validateFileExistence = require("./utl/validate-file-existence");
const normalizeOptions = require("./normalize-options");
const initConfig = require("./init-config");
const io = require("./utl/io");
const formatMetaInfo = require("./format-meta-info");
const setUpCliFeedbackListener = require("./listeners/cli-feedback");
const setUpPerformanceLogListener = require("./listeners/performance-log");

function extractResolveOptions(pCruiseOptions) {
  let lResolveOptions = {};
  const lWebPackConfigFileName = _get(
    pCruiseOptions,
    "ruleSet.options.webpackConfig.fileName",
    null
  );

  if (lWebPackConfigFileName) {
    lResolveOptions = extractWebpackResolveConfig(
      lWebPackConfigFileName,
      _get(pCruiseOptions, "ruleSet.options.webpackConfig.env", null),
      _get(pCruiseOptions, "ruleSet.options.webpackConfig.arguments", null)
    );
  }
  return lResolveOptions;
}

function extractTSConfigOptions(pCruiseOptions) {
  let lReturnValue = {};
  const lTSConfigFileName = _get(
    pCruiseOptions,
    "ruleSet.options.tsConfig.fileName",
    null
  );

  if (lTSConfigFileName) {
    lReturnValue = extractTSConfig(lTSConfigFileName);
  }

  return lReturnValue;
}

function extractBabelConfigOptions(pCruiseOptions) {
  let lReturnValue = {};
  const lBabelConfigFileName = _get(
    pCruiseOptions,
    "ruleSet.options.babelConfig.fileName",
    null
  );

  if (lBabelConfigFileName) {
    lReturnValue = extractBabelConfig(lBabelConfigFileName);
  }

  return lReturnValue;
}

function setUpListener(pCruiseOptions) {
  const lString2Listener = {
    "cli-feedback": setUpCliFeedbackListener,
    "performance-log": setUpPerformanceLogListener,
  };
  const lListenerID = _get(
    pCruiseOptions,
    "progress",
    _get(pCruiseOptions, "ruleSet.options.progress.type")
  );
  const lListenerFunction = _get(lString2Listener, lListenerID);
  /* istanbul ignore next */
  if (Boolean(lListenerFunction)) {
    lListenerFunction(bus);
  }
}

function runCruise(pFileDirectoryArray, pCruiseOptions) {
  pFileDirectoryArray
    .filter((pFileOrDirectory) => !glob.hasMagic(pFileOrDirectory))
    .forEach(validateFileExistence);

  const lCruiseOptions = normalizeOptions(pCruiseOptions);

  setUpListener(lCruiseOptions);

  bus.emit("start");
  const lReportingResult = main.futureCruise(
    pFileDirectoryArray,
    lCruiseOptions,
    extractResolveOptions(lCruiseOptions),
    {
      tsConfig: extractTSConfigOptions(lCruiseOptions),
      babelConfig: extractBabelConfigOptions(lCruiseOptions),
    }
  );

  bus.emit("progress", "cli: writing results");
  bus.emit("write-start");
  io.write(lCruiseOptions.outputTo, lReportingResult.output);
  bus.emit("end");

  return lReportingResult.exitCode;
}

module.exports = (pFileDirectoryArray, pCruiseOptions) => {
  pCruiseOptions = pCruiseOptions || {};
  let lExitCode = 0;

  try {
    if (pCruiseOptions.info === true) {
      process.stdout.write(formatMetaInfo());
    } else if (pCruiseOptions.init) {
      initConfig(pCruiseOptions.init);
    } else {
      lExitCode = runCruise(pFileDirectoryArray, pCruiseOptions);
    }
  } catch (pError) {
    process.stderr.write(`\n  ERROR: ${pError.message}\n`);
    bus.emit("end");
    lExitCode = 1;
  }

  return lExitCode;
};
