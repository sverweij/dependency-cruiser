const figures = require("figures");

function toFlatModuleDependencies(pModule) {
  return pModule.dependencies.map((pDependency) => ({
    from: pModule.source,
    to: pDependency.resolved,
  }));
}

function toFlatDependencies(pModules) {
  return pModules.reduce(
    (pAll, pModule) => pAll.concat(toFlatModuleDependencies(pModule)),
    []
  );
}

function stringify(pFlatDependency) {
  return `${pFlatDependency.from} ${figures.arrowRight} ${pFlatDependency.to}`;
}

function report(pResults) {
  return toFlatDependencies(pResults.modules).reduce(
    (pAll, pDependency) => pAll.concat(stringify(pDependency)).concat("\n"),
    ""
  );
}

/**
 * Returns the results of a cruise in a text only format
 * - for each dependency the from and the two, separated by an arrow.
 * @param {ICruiseResult} pResults -
 * @param {any} pOptions - An object with options;
 *                         {boolean} long - whether or not to include an explanation
 *                                          (/ comment) which each violation
 * @returns {IReporterOutput} - output: the formatted text in a string
 *                              exitCode: the number of errors found
 */
module.exports = (pResults) => ({
  output: report(pResults),
  exitCode: 0,
});
