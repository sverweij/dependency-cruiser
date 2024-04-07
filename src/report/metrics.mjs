import { EOL } from "node:os";
import chalk from "chalk";
import { formatNumber, formatPercentage } from "./utl/index.mjs";

/**
 * @typedef {"string"|"integer"|"percent"} ColumnFormatType
 * @typedef {{title: string; format: ColumnFormatType; width: string}} IColumnMetaData
 * @typedef {Map<string,IColumnMetaData>} IMeta
 * @typedef {{name: string; moduleCount: number; afferentCouplings:number; efferentCouplings:number; instability:number; size:number; topLevelStatementCount:number;}} IData
 * @typedef {{meta: IMeta; data: IData[]}} ITableObject
 */

const METRIC_WIDTH = 5;

function getMetricsFromFolder({
  name,
  moduleCount,
  afferentCouplings,
  efferentCouplings,
  instability,
  experimentalStats,
}) {
  const lReturnValue = {
    type: "folder",
    name,
    moduleCount,
    afferentCouplings,
    efferentCouplings,
    instability,
  };
  if (experimentalStats) {
    lReturnValue.size = experimentalStats.size;
    lReturnValue.topLevelStatementCount =
      experimentalStats.topLevelStatementCount;
  }
  return lReturnValue;
}

/**
 *
 * @param {import("../../types/cruise-result.mjs").IModule} param0
 * @returns
 */
function getMetricsFromModule({
  source,
  dependents,
  dependencies,
  instability,
  experimentalStats,
}) {
  const lReturnValue = {
    type: "module",
    name: source,
    moduleCount: 1,
    afferentCouplings: dependents.length,
    efferentCouplings: dependencies.length,
    instability,
  };
  if (experimentalStats) {
    lReturnValue.size = experimentalStats.size;
    lReturnValue.topLevelStatementCount =
      experimentalStats.topLevelStatementCount;
  }
  return lReturnValue;
}

function metricsAreCalculable(pModule) {
  return Object.hasOwn(pModule, "instability");
}

function componentIsCalculable(pComponent) {
  return (
    Number.isInteger(pComponent.moduleCount) && pComponent.moduleCount > -1
  );
}

/**
 *
 * @param {{modules: import("../../types/cruise-result.mjs").IModule[]; folders: import("../../types/cruise-result.mjs").IFolder[];}} param0
 * @param {smallIntegerWidth:number; largeIntegerWidth: number} param1
 * @returns {ITableObject}
 */
// eslint-disable-next-line max-lines-per-function
function transformToTableObject(
  { modules, folders },
  { smallIntegerWidth, largeIntegerWidth },
) {
  const lReturnValue = {
    meta: new Map([
      ["type", { width: 6, title: "type", format: "string" }],
      ["name", { width: 0, title: "name", format: "string" }],
      [
        "moduleCount",
        {
          width: smallIntegerWidth,
          title: "N",
          format: "integer",
        },
      ],
      [
        "afferentCouplings",
        {
          width: smallIntegerWidth,
          title: "Ca",
          format: "integer",
        },
      ],
      [
        "efferentCouplings",
        {
          width: smallIntegerWidth,
          title: "Ce",
          format: "integer",
        },
      ],
      [
        "instability",
        {
          width: smallIntegerWidth,
          title: "I (%)",
          format: "percent",
        },
      ],
      [
        "size",
        {
          width: largeIntegerWidth,
          title: "size",
          format: "integer",
        },
      ],
      [
        "topLevelStatementCount",
        {
          width: smallIntegerWidth,
          title: "#tls",
          format: "integer",
        },
      ],
    ]),
    data: [],
  };
  lReturnValue.data = folders
    .map(getMetricsFromFolder)
    .concat(modules.filter(metricsAreCalculable).map(getMetricsFromModule))
    .filter(componentIsCalculable);

  const lMaxNameWidth = lReturnValue.data
    .map(({ name }) => name.length)
    .concat(lReturnValue.meta.get("name").title.length)
    .sort((pLeft, pRight) => pLeft - pRight)
    .pop();
  lReturnValue.meta.get("name").width = lMaxNameWidth;

  return lReturnValue;
}

function orderByNumber(pAttributeName) {
  return (pLeft, pRight) =>
    // eslint-disable-next-line security/detect-object-injection
    (pRight[pAttributeName] || 0) - (pLeft[pAttributeName] || 0);
}

function orderByString(pAttributeName) {
  return (pLeft, pRight) =>
    // eslint-disable-next-line security/detect-object-injection
    pLeft[pAttributeName].localeCompare(pRight[pAttributeName]);
}
/**
 * @param {IMeta} pMetaData
 * @returns {string}
 */
function formatToTextHeader(pMetaData) {
  return Array.from(pMetaData.values())
    .map(({ title, width, format }) =>
      format === "string" ? title.padEnd(width + 1) : title.padStart(width + 1),
    )
    .join(" ");
}

/**
 * @param {IMeta} pMetaData
 * @returns {string}
 */
function formatToTextDemarcationLine(pMetaData) {
  return Array.from(pMetaData.values())
    .map(({ width }) => "-".repeat(width + 1))
    .join(" ");
}

/**
 * @param {IData[]} pData
 * @param {IMeta} pMetaData
 * @returns {string}
 */
function formatToTextData(pData, pMetaData) {
  return pData
    .map((pRow) => {
      return Object.keys(pRow)
        .map((pKey) => {
          const lMeta = pMetaData.get(pKey);
          if (lMeta.format === "string") {
            // eslint-disable-next-line security/detect-object-injection
            return pRow[pKey].padEnd(lMeta.width + 1);
          }
          if (lMeta.format === "percent") {
            // eslint-disable-next-line security/detect-object-injection
            return formatPercentage(pRow[pKey]).padStart(lMeta.width + 1);
          }
          // eslint-disable-next-line security/detect-object-injection
          return Number.isInteger(pRow[pKey])
            ? // eslint-disable-next-line security/detect-object-injection
              formatNumber(pRow[pKey]).padStart(lMeta.width + 1)
            : "".padStart(lMeta.width + 1);
        })
        .join(" ");
    })
    .join(EOL);
}

/**
 * @param {IData[]} pData
 * @param {IMeta} pMetaData
 * @returns {string}
 */
function formatToTextTable(pData, pMetaData) {
  return [chalk.bold(formatToTextHeader(pMetaData))]
    .concat(formatToTextDemarcationLine(pMetaData))
    .concat(formatToTextData(pData, pMetaData))
    .join(EOL)
    .concat(EOL);
}

/**
 *
 * @param {{modules: import("../../types/cruise-result.mjs").IModule[]; folders: import("../../types/cruise-result.mjs").IFolder[];}} param0
 * @param {{orderBy: string; hideFolders: boolean; hideModules: boolean; experimentalStats: boolean;}} param1
 * @returns {string}
 */
function transformMetricsToTable(
  { modules, folders },
  { orderBy, hideFolders, hideModules },
) {
  /** @type {ITableObject} */
  const lObject = transformToTableObject(
    { modules, folders },
    {
      smallIntegerWidth: METRIC_WIDTH,
      largeIntegerWidth: METRIC_WIDTH + METRIC_WIDTH,
    },
  );
  let lComponents = lObject.data
    .filter(
      (pComponent) =>
        (!hideModules && pComponent.type === "module") ||
        (!hideFolders && pComponent.type === "folder"),
    )
    .sort(orderByString("name"))
    .sort(orderByNumber(orderBy || "instability"));
  return formatToTextTable(lComponents, lObject.meta);
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
