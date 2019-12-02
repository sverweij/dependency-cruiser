const dependencyIsEqual = require("./dependencyIsEqual");

module.exports = (pTSDependencies, pJSDependencies) =>
  pTSDependencies.map(pTSDependency =>
    pJSDependencies.some(dependencyIsEqual(pTSDependency))
      ? { ...pTSDependency, preCompilationOnly: false }
      : { ...pTSDependency, preCompilationOnly: true }
  );
