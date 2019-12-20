const compare = require("./compare");

module.exports = (pTSDependencies, pJSDependencies) =>
  pTSDependencies.map(pTSDependency =>
    pJSDependencies.some(compare.dependenciesEqual(pTSDependency))
      ? { ...pTSDependency, preCompilationOnly: false }
      : { ...pTSDependency, preCompilationOnly: true }
  );
