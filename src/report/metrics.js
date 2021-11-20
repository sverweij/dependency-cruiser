const { EOL } = require("os");
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
  return pMetrics.map(
    ({
      name,
      moduleCount,
      afferentCouplings,
      efferentCouplings,
      instability,
    }) => {
      return `${name.padEnd(pMaxNameWidth, " ")}  ${moduleCount
        .toString(DECIMAL_BASE)
        .padStart(METRIC_WIDTH)}  ${afferentCouplings
        .toString(DECIMAL_BASE)
        .padStart(METRIC_WIDTH)}  ${efferentCouplings
        .toString(DECIMAL_BASE)
        .padStart(METRIC_WIDTH)}  ${(Math.round(YADDUM * instability) / YADDUM)
        .toString(DECIMAL_BASE)
        .padEnd(METRIC_WIDTH)}`;
    }
  );
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
  return Object.prototype.hasOwnProperty.call(pModule, "instability");
}

function orderByInstability(pLeft, pRight) {
  return pRight.instability - pLeft.instability;
}

function transformMetricsToTable({ modules, folders }) {
  // TODO: should probably use a table module for this (i.e. text-table)
  // to simplify this code
  const lComponents = folders.concat(
    modules.filter(metricsAreCalculable).map(metricifyModule)
  );
  const lMaxNameWidth = lComponents
    .map(({ name }) => name.length)
    .concat(COMPONENT_HEADER.length)
    .sort((pLeft, pRight) => pLeft - pRight)
    .pop();

  return [chalk.bold(getHeader(lMaxNameWidth))]
    .concat(getDemarcationLine(lMaxNameWidth))
    .concat(
      getMetricsTable(lComponents.sort(orderByInstability), lMaxNameWidth)
    )
    .join(EOL)
    .concat(EOL);
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
        `${EOL}ERROR: The cruise result didn't contain any metrics - re-running the cruise with${EOL}` +
        `       the '--metrics' command line option should fix that.${EOL}${EOL}`,
      exitCode: 1,
    };
  }
};
