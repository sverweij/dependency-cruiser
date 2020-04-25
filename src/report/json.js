/**
 * Returns the results of a cruise in JSON
 *
 * @param {ICruiseResult} pResults - the output of a dependency-cruise adhering to ../schema/cruise-result.schema.json
 * @returns {IReporterOutput} - output: the results in JSON format (hence adhering to the same json schema)
 *                     exitCode: 0
 */
module.exports = (pResults) => ({
  output: JSON.stringify(pResults, null, "  "),
  exitCode: 0,
});
