/* eslint-disable security/detect-object-injection */
const path = require("path").posix;
const { calculateInstability, metricsAreCalculable } = require("../module-utl");
const {
  getAfferentCouplings,
  getEfferentCouplings,
  getParentFolders,
  object2Array,
} = require("./utl");

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

function aggregateToFolder(pAllFolders, pModule) {
  getParentFolders(path.dirname(pModule.source)).forEach((pParentDirectory) =>
    upsertFolderAttributes(pAllFolders, pModule, pParentDirectory)
  );
  return pAllFolders;
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
  ).map((pCoupling) => ({ name: pCoupling }));
}

function calculateFolderMetrics(pFolder) {
  const lModuleDependents = object2Array(pFolder.dependents);
  const lModuleDependencies = object2Array(pFolder.dependencies);
  // this calculation might look superfluous (why not just .length the dependents
  // and dependencies?), but it isn't because there can be > 1 relation between
  // two folders
  const lAfferentCouplings = lModuleDependents.reduce(sumCounts, 0);
  const lEfferentCouplings = lModuleDependencies.reduce(sumCounts, 0);

  return {
    ...pFolder,
    afferentCouplings: lAfferentCouplings,
    efferentCouplings: lEfferentCouplings,
    instability: calculateInstability(lEfferentCouplings, lAfferentCouplings),
    dependents: getFolderLevelCouplings(lModuleDependents),
    dependencies: getFolderLevelCouplings(lModuleDependencies),
  };
}

function findFolderByName(pAllFolders, pName) {
  return pAllFolders.find((pFolder) => pFolder.name === pName);
}

function denormalizeInstability(pFolder, _, pAllFolders) {
  return {
    ...pFolder,
    dependencies: pFolder.dependencies.map((pDependency) => {
      const lFolder = findFolderByName(pAllFolders, pDependency.name) || {};
      return {
        ...pDependency,
        instability: lFolder.instability >= 0 ? lFolder.instability : 0,
      };
    }),
  };
}

module.exports = function aggregateToFolders(pModules) {
  const lFolders = object2Array(
    pModules.filter(metricsAreCalculable).reduce(aggregateToFolder, {})
  ).map(calculateFolderMetrics);

  return lFolders.map(denormalizeInstability);
};
