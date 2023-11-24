import { EOL } from "node:os";
import dependencyToIncidenceTransformer from "./utl/dependency-to-incidence-transformer.mjs";

function renderHeader(pModules) {
  return pModules.map((pModule) => `"${pModule.source}"`).join(",");
}

function mapIncidences(pIncidences) {
  return pIncidences.map((pIncidence) => `"${pIncidence.incidence}"`).join(",");
}

function renderBody(pModules) {
  return pModules
    .map(
      (pModule) =>
        `"${pModule.source}",${mapIncidences(pModule.incidences)},""`,
    )
    .join(EOL);
}

function report(pModules) {
  return `"",${renderHeader(pModules)},""${EOL}${renderBody(pModules)}${EOL}`;
}

/**
 * Returns the results of a cruise in an 'incidence matrix'
 *
 * @param {import("../../types/cruise-result.mjs").ICruiseResult} pResults -
 * the output of a dependency-cruise adhering to ../../schema/cruise-result.schema.json
 * @returns {import("../../types/dependency-cruiser.js").IReporterOutput}
 */
export default function csv(pResults) {
  return {
    output: report(dependencyToIncidenceTransformer(pResults.modules)),
    exitCode: 0,
  };
}
