const os = require("os");
const chalk = require("chalk");

const DECIMAL_BASE = 10;
const METRIC_WIDTH = 4;
const INSTABILITY_DECIMALS = 2;
const YADDUM = DECIMAL_BASE ** INSTABILITY_DECIMALS;
const COMPONENT_HEADER = "name";

function getHeader(pMaxNameWidth) {
  return `${COMPONENT_HEADER.padEnd(pMaxNameWidth)} ${"N".padStart(
    METRIC_WIDTH + 1
  )} ${"Ca".padStart(METRIC_WIDTH + 1)} ${"Ce".padStart(
    METRIC_WIDTH + 1
  )}  ${"I".padEnd(METRIC_WIDTH + 1)}`;
}

function getDemarcationLine(pMaxNameWidth) {
  return `${"-".repeat(pMaxNameWidth)} ${"-".repeat(
    METRIC_WIDTH + 1
  )} ${"-".repeat(METRIC_WIDTH + 1)} ${"-".repeat(
    METRIC_WIDTH + 1
  )}  ${"-".repeat(METRIC_WIDTH + 1)}`;
}

function getMetricsTable(pMetrics, pMaxNameWidth) {
  return pMetrics.map((pMetric) => {
    return `${pMetric.name.padEnd(pMaxNameWidth, " ")}  ${pMetric.moduleCount
      .toString(DECIMAL_BASE)
      .padStart(METRIC_WIDTH)}  ${pMetric.afferentCouplings
      .toString(DECIMAL_BASE)
      .padStart(METRIC_WIDTH)}  ${pMetric.efferentCouplings
      .toString(DECIMAL_BASE)
      .padStart(METRIC_WIDTH)}  ${(
      Math.round(YADDUM * pMetric.instability) / YADDUM
    )
      .toString(DECIMAL_BASE)
      .padEnd(METRIC_WIDTH)}`;
  });
}

function metricifyModule({ source, dependents, dependencies, instability }) {
  return {
    name: source,
    moduleCount: 1,
    afferentCouplings: dependents.length,
    efferentCouplings: dependencies.length,
    instability,
  };
}

function metricsAreCalculable(pModule) {
  return (
    !pModule.coreModule &&
    !pModule.couldNotResolve &&
    !pModule.matchesDoNotFollow
  );
}

function orderByInstability(pLeft, pRight) {
  return pRight.instability - pLeft.instability;
}
function transformMetricsToTable({ modules, folders }) {
  // TODO: should probably use a table module for this (i.e. text-table)
  // to simplify this code
  const lMaxNameWidth = folders
    .map((pFolder) => pFolder.name.length)
    .concat(modules.map((pModule) => pModule.source.length))
    .concat(COMPONENT_HEADER.length)
    .sort((pLeft, pRight) => pLeft - pRight)
    .pop();

  return [chalk.bold(getHeader(lMaxNameWidth))]
    .concat(getDemarcationLine(lMaxNameWidth))
    .concat(
      getMetricsTable(
        folders
          .concat(modules.filter(metricsAreCalculable).map(metricifyModule))
          .sort(orderByInstability),
        lMaxNameWidth
      )
    )
    .join(os.EOL)
    .concat(os.EOL);
}

/**
 * Metrics plugin - to test the waters. If we want to use metrics in other
 * reporters - or use e.g. the Ca/ Ce/ I in rules (e.g. to detect violations
 * of Uncle Bob's variable dependency principle)
 *
 * @param {import('../../types/dependency-cruiser').ICruiseResult} pCruiseResult -
 *      the output of a dependency-cruise adhering to dependency-cruiser's
 *      cruise result schema
 * @return {import('../../types/dependency-cruiser').IReporterOutput} -
 *      output: some metrics on folders and dependencies
 *      exitCode: 0
 */
module.exports = (pCruiseResult) => {
  if (pCruiseResult.folders) {
    return {
      output: transformMetricsToTable(pCruiseResult),
      exitCode: 0,
    };
  } else {
    return {
      output:
        `${os.EOL}ERROR: The cruise result didn't contain any metrics - re-running the cruise with${os.EOL}` +
        `       the '--metrics' command line option should fix that.${os.EOL}${os.EOL}`,
      exitCode: 1,
    };
  }
};
