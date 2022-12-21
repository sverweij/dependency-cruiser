const get = require("lodash/get");
const has = require("lodash/has");
const filterBank = require("../graph-utl/filter-bank");
const summarize = require("../enrich/summarize");
const consolidateToPattern = require("../graph-utl/consolidate-to-pattern");
const compare = require("../graph-utl/compare");
const stripSelfTransitions = require("../graph-utl/strip-self-transitions");
const report = require("../report");

/**
 *
 * @param {import('../..').ICruiseResult} pResult
 * @param {import('../..').IFormatOptions} pFormatOptions
 * @returns {import('../..').ICruiseResult}
 */
function reSummarizeResults(pResult, pFormatOptions) {
  let lModules = filterBank.applyFilters(pResult.modules, pFormatOptions);

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
 * @param {import("../..").IFormatOptions} pFormatOptions
 * @returns {import("../..").IReporterOutput}
 */
module.exports = function reportWrap(pResult, pFormatOptions) {
  const lReportFunction = report.getReporter(pFormatOptions.outputType);
  const lReportOptions = get(
    pResult,
    `summary.optionsUsed.reporterOptions.${pFormatOptions.outputType}`,
    {}
  );

  return lReportFunction(
    reSummarizeResults(pResult, pFormatOptions),
    // passing format options here so reporters that read collapse patterns
    // from the result take the one passed in the format options instead
    has(pFormatOptions, "collapse")
      ? { ...lReportOptions, collapsePattern: pFormatOptions.collapse }
      : lReportOptions
  );
};
