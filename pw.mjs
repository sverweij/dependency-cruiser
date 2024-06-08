import { basename, dirname } from "node:path";

const EOL = "\n";

const template = `graph {
	layout=patchwork
    fontname=Helvetica
    fontsize=9
    node [style=filled fontname=Helvetica fontsize=9]
	$\{modules}
}
`;

const LOCALE = undefined;
const K = 1024;
const formatSize = new Intl.NumberFormat(LOCALE, {
  signDisplay: "never",
  style: "unit",
  unit: "kilobyte",
  unitDisplay: "narrow",
  maximumFractionDigits: 3,
  minimumFractionDigits: 3,
}).format;

const formatNumber = new Intl.NumberFormat(LOCALE).format;

// const formatNumber = (pX) => pX;

const size2color = [
  [16_384, "darkred"],
  [8_192, "red"],
  [4_096, "orange"],
  [2_048, "yellow"],
  [1_024, "green"],
  [512, "lightgreen"],
  [0, "white"],
];

function getColor(pSize) {
  let lReturnValue = "#ffffff";

  for (const [lSize, lColor] of size2color) {
    if (pSize >= lSize) {
      return lColor;
    }
  }
  return lReturnValue;
}

/**
 * Returns the results of a cruise in JSON
 *
 * @param {import("../../types/cruise-result").ICruiseResult} pResults
 * @returns {import("../../types/dependency-cruiser").IReporterOutput}
 */
export default function json(pResults) {
  return {
    output:
      template.replace(
        "${modules}",
        pResults.modules
          .filter((pModule) => pModule.experimentalStats?.size)
          .filter(
            (pModule) =>
              !pModule.source.endsWith(".json") &&
              !pModule.source.endsWith(".ts"),
          )
          .map((pModule) => {
            return `"${basename(pModule.source) + EOL + dirname(pModule.source) + EOL + formatSize(pModule.experimentalStats.size / K)}" [area=${pModule.experimentalStats.size / (K / 3)} fillcolor="${getColor(pModule.experimentalStats.size)}"]`;
          })
          .join(EOL),
      ) + EOL,
    exitCode: 0,
  };
}
