/**
 * Returns the results of a cruise in a javascript object
 *
 * @param {any} pResults - the output of a dependency-cruise adhering to ../schema/cruise-result.schema.json
 * @returns {object} - output: the results in a javascript object (hence adhering to the same json schema)
 *                     exitCode: 0
 */
module.exports = pResults => ({
  output: pResults,
  exitCode: 0
});
