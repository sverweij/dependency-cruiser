const _get = require("lodash/get");
const _has = require("lodash/has");
const filterbank = require("../graph-utl/filterbank");
const summarize = require("../enrich/summarize");
const consolidateToPattern = require("../graph-utl/consolidate-to-pattern");
const compare = require("../graph-utl/compare");
const stripSelfTransitions = require("../graph-utl/strip-self-transitions");
const report = require("../report");

/**
 *
 * @param {import('../../types/dependency-cruiser').ICruiseResult} pResult
 * @param {import('../../types/dependency-cruiser').IFormatOptions} pFormatOptions
 * @returns {import('../../types/dependency-cruiser').ICruiseResult}
 */
function reSummarizeResults(pResult, pFormatOptions) {
  let lModules = filterbank.applyFilters(pResult.modules, pFormatOptions);

  if (_has(pFormatOptions, "collapse")) {
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
        pFormatOptions,
        (pResult.summary.optionsUsed.args || "").split(" "),
        // TODO: apply filters to the folders too
        pResult.folders
      ),
    },
    modules: lModules,
  };
}

module.exports = function reportWrap(pResult, pFormatOptions) {
  const lReportFunction = report.getReporter(pFormatOptions.outputType);
  const lReportOptions = _get(
    pResult,
    `summary.optionsUsed.reporterOptions.${pFormatOptions.outputType}`,
    {}
  );

  return lReportFunction(
    reSummarizeResults(pResult, pFormatOptions),
    // passing format options here so reporters that read collapse patterns
    // from the result take the one passed in the format options instead
    _has(pFormatOptions, "collapse")
      ? { ...lReportOptions, collapsePattern: pFormatOptions.collapse }
      : lReportOptions
  );
};
