import { EOL } from "node:os";
import chalk from "chalk";
import { formatPercentage } from "./utl/index.mjs";

const DECIMAL_BASE = 10;
const METRIC_WIDTH = 5;
const COMPONENT_HEADER = "name";

function getHeader(pMaxNameWidth) {
  return `${COMPONENT_HEADER.padEnd(pMaxNameWidth)} ${"N".padStart(
    METRIC_WIDTH + 1
  )} ${"Ca".padStart(METRIC_WIDTH + 1)} ${"Ce".padStart(
    METRIC_WIDTH + 1
  )} ${"I (%)".padStart(METRIC_WIDTH + 1)}`;
}

function getDemarcationLine(pMaxNameWidth) {
  return `${"-".repeat(pMaxNameWidth)} ${"-".repeat(
    METRIC_WIDTH + 1
  )} ${"-".repeat(METRIC_WIDTH + 1)} ${"-".repeat(
    METRIC_WIDTH + 1
  )} ${"-".repeat(METRIC_WIDTH + 1)}`;
}

function getMetricsTable(pMetrics, pMaxNameWidth) {
  return pMetrics.map(
    ({
      name,
      moduleCount,
      afferentCouplings,
      efferentCouplings,
      instability,
    }) =>
      `${name.padEnd(pMaxNameWidth, " ")}  ${moduleCount
        .toString(DECIMAL_BASE)
        .padStart(METRIC_WIDTH)}  ${afferentCouplings
        .toString(DECIMAL_BASE)
        .padStart(METRIC_WIDTH)}  ${efferentCouplings
        .toString(DECIMAL_BASE)
        .padStart(METRIC_WIDTH)}  ${formatPercentage(instability).padStart(
        METRIC_WIDTH
      )}`
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

function orderByNumber(pAttributeName) {
  // eslint-disable-next-line security/detect-object-injection
  return (pLeft, pRight) => pRight[pAttributeName] - pLeft[pAttributeName];
}

function orderByString(pAttributeName) {
  return (pLeft, pRight) =>
    // eslint-disable-next-line security/detect-object-injection
    pLeft[pAttributeName].localeCompare(pRight[pAttributeName]);
}

function componentIsCalculable(pComponent) {
  return (
    Number.isInteger(pComponent.moduleCount) && pComponent.moduleCount > -1
  );
}

function transformMetricsToTable(
  { modules, folders },
  { orderBy, hideFolders, hideModules }
) {
  // TODO: should probably use a table module for this (i.e. text-table)
  // to simplify this code
  let lComponents = [];
  lComponents = lComponents.concat(hideFolders ? [] : folders);
  lComponents = lComponents.concat(
    hideModules ? [] : modules.filter(metricsAreCalculable).map(metricifyModule)
  );
  const lMaxNameWidth = lComponents
    .map(({ name }) => name.length)
    .concat(COMPONENT_HEADER.length)
    .sort((pLeft, pRight) => pLeft - pRight)
    .pop();

  return [chalk.bold(getHeader(lMaxNameWidth))]
    .concat(getDemarcationLine(lMaxNameWidth))
    .concat(
      getMetricsTable(
        lComponents
          .filter(componentIsCalculable)
          .sort(orderByString("name"))
          .sort(orderByNumber(orderBy || "instability")),
        lMaxNameWidth
      )
    )
    .join(EOL)
    .concat(EOL);
}

/**
 * returns stability metrics of modules & folders in an ascii table
 *
 * Potential future features:
 * - additional output formats (csv?, html?)
 *
 * @param {import('../../types/dependency-cruiser.js').ICruiseResult} pCruiseResult -
 * @param {import("../../types/reporter-options.js").IMetricsReporterOptions} pReporterOptions
 * @return {import('../../types/dependency-cruiser.js').IReporterOutput} -
 */
export default function metrics(pCruiseResult, pReporterOptions) {
  const lReporterOptions = pReporterOptions || {};
  if (pCruiseResult.folders) {
    return {
      output: transformMetricsToTable(pCruiseResult, lReporterOptions),
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
}
