import { isDeepStrictEqual } from "node:util";
import { join } from "node:path/posix";
import findContentChanges from "./find-content-changes.mjs";
import {
  getFileHashSync,
  isInterestingChangeType,
  moduleIsInterestingForDiff,
} from "./helpers.mjs";

/**
 * @param {string} pBaseDirectory
 * @returns {(pModule: import("../../types/dependency-cruiser.js").IModule) => import("../../types/dependency-cruiser.js").IModule}
 */
function addCheckSumToModule(pBaseDirectory) {
  return (pModule) => {
    if (moduleIsInterestingForDiff(pModule)) {
      return {
        ...pModule,
        checksum: getFileHashSync(join(pBaseDirectory, pModule.source)),
      };
    }
    return pModule;
  };
}

/**
 * @param {import("../../types/dependency-cruiser.js").IRevisionChange[]} pChanges
 * @param {import("../../types/dependency-cruiser.js").IModule[]} pModules
 * @returns {import("../../types/dependency-cruiser.js").IRevisionChange[]}
 */
function refreshChanges(pChanges, pModules) {
  return pChanges.filter(
    (pChange) =>
      !pModules.some(
        (pModule) =>
          pModule.source === pChange.name &&
          pModule.checksum === pChange.checksum
      )
  );
}

export default class ContentStrategy {
  /**
   * @param {string} pDirectory
   * @param {import("../../types/dependency-cruiser.js").ICruiseResult} pCachedCruiseResult
   * @param {import("../../types/strict-options.js").IStrictCruiseOptions} pCruiseOptions
   * @param {Object} pOptions
   * @param {Set<string>} pOptions.extensions
   * @param {Set<import("watskeburt").changeTypeType>} pOptions.interestingChangeTypes
   * @param {string} pOptions.baseDir
   * @param {(pString:string) => Array<import("watskeburt").IChange>} pOptions.diffListFn
   * @param {(import("watskeburt").IChange) => import("../..").IRevisionChange} pOptions.checksumFn
   * @returns {import("../../types/dependency-cruiser.js").IRevisionData}
   */
  getRevisionData(pDirectory, pCachedCruiseResult, pCruiseOptions, pOptions) {
    const lOptions = {
      diffListFn: findContentChanges,
      baseDir: process.cwd(),
      ...pOptions,
    };
    return {
      SHA1: "unknown-in-content-cache-strategy",
      changes: lOptions
        .diffListFn(pDirectory, pCachedCruiseResult, {
          baseDir: lOptions.baseDir,
          extensions: lOptions.extensions,
          includeOnly: pCruiseOptions.includeOnly,
          exclude: pCruiseOptions.exclude,
        })
        .filter(isInterestingChangeType(lOptions.interestingChangeTypes)),
    };
  }

  /**
   * @param {import("../../types/dependency-cruiser.js").IRevisionData} pExistingRevisionData
   * @param {import("../../types/dependency-cruiser.js").IRevisionData} pNewRevisionData
   * @returns {boolean}
   */
  revisionDataEqual(pExistingRevisionData, pNewRevisionData) {
    return (
      Boolean(pExistingRevisionData) &&
      Boolean(pNewRevisionData) &&
      // Even though we don't really have a SHA1, it might be the previous version
      // of the cache did, e.g. because it was rendered with the metadata cache
      // strategy. In that case the SHA1 comparison is a reliable, fast bailout.
      pExistingRevisionData.SHA1 === pNewRevisionData.SHA1 &&
      isDeepStrictEqual(pExistingRevisionData.changes, pNewRevisionData.changes)
    );
  }

  /**
   * @param {import("../../types/dependency-cruiser.js").ICruiseResult} pCruiseResult
   * @param {import("../../types/dependency-cruiser.js").IRevisionData} pRevisionData
   * @returns {import("../../types/dependency-cruiser.js").ICruiseResult}
   */
  prepareRevisionDataForSaving(pCruiseResult, pRevisionData) {
    const lModulesWithCheckSum = pCruiseResult.modules.map(
      addCheckSumToModule(pCruiseResult.summary.optionsUsed.baseDir)
    );
    const lRevisionData = {
      ...pRevisionData,
      changes: refreshChanges(pRevisionData.changes, lModulesWithCheckSum),
    };

    return {
      ...pCruiseResult,
      modules: lModulesWithCheckSum,
      revisionData: lRevisionData,
    };
  }
}
