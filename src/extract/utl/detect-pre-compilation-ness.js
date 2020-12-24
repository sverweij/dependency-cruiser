const compare = require("./compare");

module.exports = function detectPreCompilationNess(
  pTSDependencies,
  pJSDependencies
) {
  return pTSDependencies.map((pTSDependency) =>
    pJSDependencies.some(compare.dependenciesEqual(pTSDependency))
      ? { ...pTSDependency, preCompilationOnly: false }
      : { ...pTSDependency, preCompilationOnly: true }
  );
};
