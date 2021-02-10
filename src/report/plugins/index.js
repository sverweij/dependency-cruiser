const has = require("lodash/has");

function isValidPlugin(pPluginFunction) {
  let lReturnValue = false;
  /** @type {import('../../../types/dependency-cruiser').ICruiseResult} */
  const lMinimalCruiseResult = {
    modules: [],
    summary: {
      error: 0,
      info: 0,
      warn: 0,
      totalCruised: 0,
      violations: [],
      optionsUsed: {},
    },
  };

  if (typeof pPluginFunction === "function") {
    const lTestReportOutput = pPluginFunction(lMinimalCruiseResult);
    lReturnValue =
      has(lTestReportOutput, "output") &&
      has(lTestReportOutput, "exitCode") &&
      typeof lTestReportOutput.exitCode === "number";
  }
  return lReturnValue;
}

function getPluginReporter(pOutputType) {
  let lReturnValue = false;

  try {
    // eslint-disable-next-line import/no-dynamic-require, node/global-require, security/detect-non-literal-require
    lReturnValue = require(pOutputType);
  } catch (pError) {
    throw new Error(`Could not find reporter plugin '${pOutputType}'`);
  }
  if (!isValidPlugin(lReturnValue)) {
    throw new Error(`${pOutputType} is not a valid plugin`);
  }
  return lReturnValue;
}

function getExternalPluginReporter(pOutputType) {
  const lPluginPatternRE = /^plugin:(.+)$/;
  const lPluginMatch = (pOutputType || "").match(lPluginPatternRE);

  if (Boolean(lPluginMatch)) {
    const lPluginName = lPluginMatch[1];
    return getPluginReporter(lPluginName);
  }
  return false;
}

module.exports = {
  getExternalPluginReporter,
  getPluginReporter,
  isValidPlugin,
};
