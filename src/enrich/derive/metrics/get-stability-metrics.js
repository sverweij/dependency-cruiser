/* eslint-disable security/detect-object-injection */
const path = require("path").posix;
const { foldersObject2folderArray, getParentFolders } = require("./utl");
const {
  getAfferentCouplings,
  getEfferentCouplings,
  metricsAreCalculable,
} = require("./module-utl");

function upsertCouplings(pAllDependents, pNewDependents) {
  pNewDependents.forEach((pNewDependent) => {
    pAllDependents[pNewDependent] = pAllDependents[pNewDependent] || {
      count: 0,
    };
    pAllDependents[pNewDependent].count += 1;
  });
}

function upsertFolderAttributes(pAllMetrics, pModule, pDirname) {
  pAllMetrics[pDirname] = pAllMetrics[pDirname] || {
    dependencies: {},
    dependents: {},
    moduleCount: 0,
  };

  upsertCouplings(
    pAllMetrics[pDirname].dependents,
    getAfferentCouplings(pModule, pDirname)
  );
  upsertCouplings(
    pAllMetrics[pDirname].dependencies,
    getEfferentCouplings(pModule, pDirname).map(
      (pDependency) => pDependency.resolved
    )
  );
  pAllMetrics[pDirname].moduleCount += 1;

  return pAllMetrics;
}

function orderFolderMetrics(pLeftMetric, pRightMetric) {
  // return pLeft.name.localeCompare(pRight.name);
  // For intended use in a table it's probably more useful to sort by
  // instability. Might need to be either configurable or flexible
  // in the output, though
  return pRightMetric.instability - pLeftMetric.instability;
}

function sumCounts(pAll, pCurrent) {
  return pAll + pCurrent.count;
}

function getFolderLevelCouplings(pCouplingArray) {
  return Array.from(
    new Set(
      pCouplingArray.map((pCoupling) =>
        path.dirname(pCoupling.name) === "."
          ? pCoupling.name
          : path.dirname(pCoupling.name)
      )
    )
  );
}

function calculateFolderMetrics(pFolder) {
  const lModuleDependents = foldersObject2folderArray(pFolder.dependents);
  const lModuleDependencies = foldersObject2folderArray(pFolder.dependencies);
  const lAfferentCouplings = lModuleDependents.reduce(sumCounts, 0);
  const lEfferentCouplings = lModuleDependencies.reduce(sumCounts, 0);

  return {
    ...pFolder,
    afferentCouplings: lAfferentCouplings,
    efferentCouplings: lEfferentCouplings,
    // when both afferentCouplings and efferentCouplings equal 0 instability will
    // yield NaN. Judging Bob Martin's intention, a component with no outgoing
    // dependencies is maximum stable (0)
    instability:
      lEfferentCouplings / (lEfferentCouplings + lAfferentCouplings) || 0,
    dependents: getFolderLevelCouplings(lModuleDependents),
    dependencies: getFolderLevelCouplings(lModuleDependencies),
  };
}

module.exports = function getStabilityMetrics(pModules) {
  return foldersObject2folderArray(
    pModules.filter(metricsAreCalculable).reduce((pAllFolders, pModule) => {
      getParentFolders(path.dirname(pModule.source)).forEach(
        (pParentDirectory) =>
          upsertFolderAttributes(pAllFolders, pModule, pParentDirectory)
      );
      return pAllFolders;
    }, {})
  )
    .map(calculateFolderMetrics)
    .sort(orderFolderMetrics);
};
