const glob = require("glob");
const _get = require("lodash/get");
const main = require("../main");
const parseTSConfig = require("./parse-ts-config");
const getResolveConfig = require("./get-resolve-config");
const validateFileExistence = require("./utl/validate-file-existence");
const normalizeOptions = require("./normalize-options");
const initConfig = require("./init-config");
const io = require("./utl/io");
const formatMetaInfo = require("./format-meta-info");

function extractResolveOptions(pOptions) {
  let lResolveOptions = {};
  const lWebPackConfigFileName = _get(
    pOptions,
    "ruleSet.options.webpackConfig.fileName",
    null
  );

  if (lWebPackConfigFileName) {
    lResolveOptions = getResolveConfig(
      lWebPackConfigFileName,
      _get(pOptions, "ruleSet.options.webpackConfig.env", null),
      _get(pOptions, "ruleSet.options.webpackConfig.arguments", null)
    );
  }
  return lResolveOptions;
}

function extractTSConfigOptions(pOptions) {
  let lRetval = {};
  const lTSConfigFileName = _get(
    pOptions,
    "ruleSet.options.tsConfig.fileName",
    null
  );

  if (lTSConfigFileName) {
    lRetval = parseTSConfig(lTSConfigFileName);
  }

  return lRetval;
}

function runCruise(pFileDirArray, pOptions) {
  pFileDirArray
    .filter(pFileOrDir => !glob.hasMagic(pFileOrDir))
    .forEach(validateFileExistence);

  pOptions = normalizeOptions(pOptions);

  const lReportingResult = main.cruise(
    pFileDirArray,
    pOptions,
    extractResolveOptions(pOptions),
    extractTSConfigOptions(pOptions)
  );

  io.write(pOptions.outputTo, lReportingResult.output);

  return lReportingResult.exitCode;
}

module.exports = (pFileDirArray, pOptions) => {
  pOptions = pOptions || {};
  let lExitCode = 0;

  try {
    if (pOptions.info === true) {
      process.stdout.write(formatMetaInfo());
    } else if (pOptions.init) {
      initConfig(pOptions.init);
    } else {
      lExitCode = runCruise(pFileDirArray, pOptions);
    }
  } catch (pError) {
    process.stderr.write(`\n  ERROR: ${pError.message}\n`);
    lExitCode = 1;
  }
  return lExitCode;
};
