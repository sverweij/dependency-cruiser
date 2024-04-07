/* eslint-disable security/detect-object-injection */
import { dirname } from "node:path/posix";
import { calculateInstability, metricsAreCalculable } from "../module-utl.mjs";
import detectCycles from "../circular.mjs";
import {
  findFolderByName,
  getAfferentCouplings,
  getEfferentCouplings,
  getParentFolders,
  object2Array,
} from "./utl.mjs";
import IndexedModuleGraph from "#graph-utl/indexed-module-graph.mjs";
import { uniq } from "#utl/array-util.mjs";

function upsertCouplings(pAllDependents, pNewDependents) {
  pNewDependents.forEach((pNewDependent) => {
    pAllDependents[pNewDependent] = pAllDependents[pNewDependent] || {
      count: 0,
    };
    pAllDependents[pNewDependent].count += 1;
  });
}

/**
 *
 * @param {any} pAllMetrics
 * @param {import("../../../../types/cruise-result.d.mts").IModule} pModule
 * @param {string} pDirname
 * @returns {any}
 */

function upsertFolderAttributes(pAllMetrics, pModule, pDirname) {
  pAllMetrics[pDirname] = pAllMetrics[pDirname] || {
    dependencies: {},
    dependents: {},
    moduleCount: 0,
  };

  upsertCouplings(
    pAllMetrics[pDirname].dependents,
    getAfferentCouplings(pModule, pDirname),
  );
  upsertCouplings(
    pAllMetrics[pDirname].dependencies,
    getEfferentCouplings(pModule, pDirname).map(
      (pDependency) => pDependency.resolved,
    ),
  );
  pAllMetrics[pDirname].moduleCount += 1;

  if (pModule.experimentalStats) {
    if (!Object.hasOwn(pAllMetrics[pDirname], "experimentalStats")) {
      pAllMetrics[pDirname].experimentalStats = {
        size: 0,
        topLevelStatementCount: 0,
      };
    }
    pAllMetrics[pDirname].experimentalStats.size +=
      pModule.experimentalStats.size;
    pAllMetrics[pDirname].experimentalStats.topLevelStatementCount +=
      pModule.experimentalStats.topLevelStatementCount;
  }
  return pAllMetrics;
}

function aggregateToFolder(pAllFolders, pModule) {
  getParentFolders(dirname(pModule.source)).forEach((pParentDirectory) =>
    upsertFolderAttributes(pAllFolders, pModule, pParentDirectory),
  );
  return pAllFolders;
}

function sumCounts(pAll, pCurrent) {
  return pAll + pCurrent.count;
}

function getFolderLevelCouplings(pCouplingArray) {
  return uniq(
    pCouplingArray.map((pCoupling) =>
      dirname(pCoupling.name) === "."
        ? pCoupling.name
        : dirname(pCoupling.name),
    ),
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

function deNormalizeInstability(pFolder, _, pAllFolders) {
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

function getSinks(pFolders) {
  const lKnownFolders = new Set(pFolders.map(({ name }) => name));
  const lAllFolders = uniq(
    pFolders.flatMap(({ dependencies }) =>
      dependencies.map(({ name }) => name),
    ),
  );
  const lReturnValue = lAllFolders
    .filter((pFolder) => !lKnownFolders.has(pFolder))
    .map((pFolder) => ({
      name: pFolder,
      moduleCount: -1,
      dependencies: [],
      dependents: [],
    }));
  return lReturnValue;
}

export default function aggregateToFolders(pModules) {
  let lFolders = object2Array(
    pModules.filter(metricsAreCalculable).reduce(aggregateToFolder, {}),
  )
    .map(calculateFolderMetrics)
    .map(deNormalizeInstability);
  lFolders = lFolders.concat(getSinks(lFolders));

  return detectCycles(lFolders, new IndexedModuleGraph(lFolders, "name"), {
    pSourceAttribute: "name",
    pDependencyName: "name",
  });
}
