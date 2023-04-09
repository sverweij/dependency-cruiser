import has from "lodash/has.js";
import { applyFilters } from "../graph-utl/filter-bank.mjs";
import summarize from "../enrich/summarize/index.mjs";
import consolidateToPattern from "../graph-utl/consolidate-to-pattern.mjs";
import compare from "../graph-utl/compare.mjs";
import stripSelfTransitions from "../graph-utl/strip-self-transitions.mjs";
import report from "../report/index.mjs";

/**
 *
 * @param {import('../../types/dependency-cruiser.js').ICruiseResult} pResult
 * @param {import('../../types/dependency-cruiser.js').IFormatOptions} pFormatOptions
 * @returns {import('../../types/dependency-cruiser.js').ICruiseResult}
 */
function reSummarizeResults(pResult, pFormatOptions) {
  let lModules = applyFilters(pResult.modules, pFormatOptions);

  if (has(pFormatOptions, "collapse")) {
    lModules = consolidateToPattern(lModules, pFormatOptions.collapse)
      .sort(compare.modules)
      .map(stripSelfTransitions);
  }
  return {
    ...pResult,
    summary: {
      ...pResult.summary,
      ...summarize(
        lModules,
        {
          ...pResult.summary.optionsUsed,
          ...pFormatOptions,
        },
        (pResult.summary.optionsUsed.args || "").split(" "),
        // TODO: apply filters to the folders too
        pResult.folders
      ),
    },
    modules: lModules,
  };
}

/**
 *
 * @param {import("../..).ICruiseResult} pResult result of a previous run of dependency-cruiser
 * @param {import("../../types/dependency-cruiser.js").IFormatOptions} pFormatOptions
 * @returns {import("../../types/dependency-cruiser.js").IReporterOutput}
 */
export default async function reportWrap(pResult, pFormatOptions) {
  const lReportFunction = await report.getReporter(pFormatOptions.outputType);
  const lReportOptions =
    pResult.summary.optionsUsed?.reporterOptions?.[pFormatOptions.outputType] ??
    {};

  return lReportFunction(
    reSummarizeResults(pResult, pFormatOptions),
    // passing format options here so reporters that read collapse patterns
    // from the result take the one passed in the format options instead
    has(pFormatOptions, "collapse")
      ? { ...lReportOptions, collapsePattern: pFormatOptions.collapse }
      : lReportOptions
  );
}
