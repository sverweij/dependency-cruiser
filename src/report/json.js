/**
 * Returns the results of a cruise in JSON
 *
 * @param {any} pResults - the output of a dependency-cruise adhering to ../extract/results-schema.json
 * @returns {string} - the results in JSON format (hence adhering to the same json schema)
 */
module.exports = pResults => JSON.stringify(pResults, null, "  ");
