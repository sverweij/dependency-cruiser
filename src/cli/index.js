const glob = require("glob");
const _get = require("lodash/get");
const main = require("../main");
const parseTSConfig = require("./parse-ts-config");
const parseBabelConfig = require("./parse-babel-config");
const getResolveConfig = require("./get-resolve-config");
const validateFileExistence = require("./utl/validate-file-existence");
const normalizeOptions = require("./normalize-options");
const initConfig = require("./init-config");
const io = require("./utl/io");
const formatMetaInfo = require("./format-meta-info");

function extractResolveOptions(pCruiseOptions) {
  let lResolveOptions = {};
  const lWebPackConfigFileName = _get(
    pCruiseOptions,
    "ruleSet.options.webpackConfig.fileName",
    null
  );

  if (lWebPackConfigFileName) {
    lResolveOptions = getResolveConfig(
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
    lReturnValue = parseTSConfig(lTSConfigFileName);
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
    lReturnValue = parseBabelConfig(lBabelConfigFileName);
  }

  return lReturnValue;
}

function runCruise(pFileDirectoryArray, pCruiseOptions) {
  pFileDirectoryArray
    .filter((pFileOrDirectory) => !glob.hasMagic(pFileOrDirectory))
    .forEach(validateFileExistence);

  pCruiseOptions = normalizeOptions(pCruiseOptions);

  const lReportingResult = main.futureCruise(
    pFileDirectoryArray,
    pCruiseOptions,
    extractResolveOptions(pCruiseOptions),
    {
      tsConfig: extractTSConfigOptions(pCruiseOptions),
      babelConfig: extractBabelConfigOptions(pCruiseOptions),
    }
  );

  io.write(pCruiseOptions.outputTo, lReportingResult.output);

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
    lExitCode = 1;
  }
  return lExitCode;
};
