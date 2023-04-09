import Handlebars from "handlebars/runtime.js";
import dependencyToIncidenceTransformer from "../utl/dependency-to-incidence-transformer.mjs";

await import("./html.template.js");

function addShowTitle(pDependencyEntry) {
  return {
    ...pDependencyEntry,
    incidences: pDependencyEntry.incidences.map((pIncidence) => ({
      ...pIncidence,
      hasRelation: pIncidence.incidence !== "false",
    })),
  };
}

function report(pResults) {
  return Handlebars.templates["html.template.hbs"]({
    modules: dependencyToIncidenceTransformer(pResults.modules).map(
      addShowTitle
    ),
  });
}

/**
 * Returns the results of a cruise in an 'incidence matrix'
 *
 * @param {import("../../../types/cruise-result.js").ICruiseResult} pResults
 * @returns {import("../../../types/dependency-cruiser.js").IReporterOutput}
 */
export default function html(pResults) {
  return {
    output: report(pResults),
    exitCode: 0,
  };
}
