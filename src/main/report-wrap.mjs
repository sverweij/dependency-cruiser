import report from "#report/index.mjs";
import summarize from "#enrich/summarize/index.mjs";
import { applyFilters } from "#graph-utl/filter-bank.mjs";
import consolidateToPattern from "#graph-utl/consolidate-to-pattern.mjs";
import compare from "#graph-utl/compare.mjs";
import stripSelfTransitions from "#graph-utl/strip-self-transitions.mjs";

/**
 *
 * @param {import('../../types/dependency-cruiser.js').ICruiseResult} pResult
 * @param {import('../../types/dependency-cruiser.js').IFormatOptions} pFormatOptions
 * @returns {import('../../types/dependency-cruiser.js').ICruiseResult}
 */
function reSummarizeResults(pResult, pFormatOptions) {
  let lModules = applyFilters(pResult.modules, pFormatOptions);

  if (Object.hasOwn(pFormatOptions, "collapse")) {
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
 * @param {import("../..).ICruiseResult} pResult result of a previous run of dependency-cruiser
 * @param {import("../../types/dependency-cruiser.js").IFormatOptions} pFormatOptions
 * @returns {import("../../types/dependency-cruiser.js").IReporterOutput}
 */
export default async function reportWrap(pResult, pFormatOptions) {
  const lReportFunction = await report.getReporter(pFormatOptions.outputType);
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
