import { getReporter } from "#report/index.mjs";
import summarize from "#enrich/summarize/index.mjs";
import { applyFilters } from "#graph-utl/filter-bank.mjs";
import consolidateToPattern from "#graph-utl/consolidate-to-pattern.mjs";
import { compareModules } from "#graph-utl/compare.mjs";
import stripSelfTransitions from "#graph-utl/strip-self-transitions.mjs";

/**
 * @import { ICruiseResult } from "../../types/cruise-result.mjs";
 * @import { IFormatOptions } from "../../types/options.mjs";
 * @import { IReporterOutput } from "../../types/dependency-cruiser.mjs";
 */

/**
 * @param {ICruiseResult} pResult
 * @param {IFormatOptions} pFormatOptions
 * @returns {ICruiseResult}
 */
function reSummarizeResults(pResult, pFormatOptions) {
  let lModules = applyFilters(pResult.modules, pFormatOptions);

  if (Object.hasOwn(pFormatOptions, "collapse")) {
    lModules = consolidateToPattern(lModules, pFormatOptions.collapse)
      .sort(compareModules)
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
        pResult.folders,
      ),
    },
    modules: lModules,
  };
}

function getReporterSection(pOutputType) {
  return pOutputType === "x-dot-webpage" ? "dot" : pOutputType;
}

/**
 *
 * @param {ICruiseResult} pResult result of a previous run of dependency-cruiser
 * @param {IFormatOptions} pFormatOptions
 * @returns {IReporterOutput}
 */
export default async function reportWrap(pResult, pFormatOptions) {
  const lReportFunction = await getReporter(pFormatOptions.outputType);
  const lReportOptions =
    pResult.summary.optionsUsed?.reporterOptions?.[
      getReporterSection(pFormatOptions.outputType)
    ] ?? {};

  return lReportFunction(
    reSummarizeResults(pResult, pFormatOptions),
    // passing format options here so reporters that read collapse patterns
    // from the result take the one passed in the format options instead
    Object.hasOwn(pFormatOptions, "collapse")
      ? { ...lReportOptions, collapsePattern: pFormatOptions.collapse }
      : lReportOptions,
  );
}
