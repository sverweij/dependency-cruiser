/**
 * Returns the results of a cruise in JSON
 *
 * @param {any} pResults - the output of a dependency-cruise adhering to ../extract/results-schema.json
 * @returns {object} - output: the results in JSON format (hence adhering to the same json schema)
 *                     exitCode: 0
 */
module.exports = pResults => ({
  output: JSON.stringify(pResults, null, "  "),
  exitCode: 0
});
