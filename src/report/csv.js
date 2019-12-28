const dependencyToIncidenceTransformer = require("./utl/dependencyToIncidenceTransformer");

function quoteString(pString) {
  return `"${pString}"`;
}

function modulesToTitleRow(pModules) {
  return pModules
    .map(pModule => pModule.source)
    .map(quoteString)
    .join(",");
}

function moduleToRow(pModule) {
  return [pModule.source]
    .concat(pModule.incidences.map(pIncidence => pIncidence.incidence))
    .map(quoteString)
    .join(",");
}

function toCsv(pResults) {
  const lModules = dependencyToIncidenceTransformer(pResults.modules);
  const lTitleRow = `"",${modulesToTitleRow(lModules)},""\n`;
  const lRows = lModules.reduce(
    (pAll, pModule) => `${pAll}${moduleToRow(pModule)},""\n`,
    ""
  );

  return lTitleRow + lRows;
}

/**
 * Returns the results of a cruise as an incidence matrix in a csv
 *
 * @param {any} pResults - the output of a dependency-cruise adhering to ../../schema/cruise-result.schema.json
 * @returns {object} - output: incidence matrix in csv format
 *                     exitCode: 0
 */
module.exports = pResults => ({
  output: toCsv(pResults),
  exitCode: 0
});
