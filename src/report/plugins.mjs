export function isValidPlugin(pPluginFunction) {
  let lReturnValue = false;
  /** @type {import('../../types/dependency-cruiser').ICruiseResult} */
  const lMinimalCruiseResult = {
    modules: [],
    summary: {
      error: 0,
      info: 0,
      warn: 0,
      ignore: 0,
      totalCruised: 0,
      violations: [],
      optionsUsed: {},
    },
  };

  if (typeof pPluginFunction === "function") {
    const lTestReportOutput = pPluginFunction(lMinimalCruiseResult);
    lReturnValue =
      Object.hasOwn(lTestReportOutput, "output") &&
      Object.hasOwn(lTestReportOutput, "exitCode") &&
      typeof lTestReportOutput.exitCode === "number";
  }
  return lReturnValue;
}

async function getPluginReporter(pOutputType) {
  let lReturnValue = false;

  try {
    const lModule = await import(pOutputType);
    lReturnValue = lModule.default;
  } catch (pError) {
    throw new Error(
      `Could not find reporter plugin '${pOutputType}' (or it isn't valid)`,
    );
  }
  if (!isValidPlugin(lReturnValue)) {
    throw new Error(`${pOutputType} is not a valid plugin`);
  }
  return lReturnValue;
}

export function getExternalPluginReporter(pOutputType) {
  const lPluginPatternRE = /^plugin:(?<pluginName>.+)$/;
  const lPluginMatch = (pOutputType || "").match(lPluginPatternRE);

  if (lPluginMatch?.groups) {
    return getPluginReporter(lPluginMatch.groups.pluginName);
  }

  return false;
}
