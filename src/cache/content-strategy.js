const { join } = require("path").posix;
const { isDeepStrictEqual } = require("util");
const findContentChanges = require("./find-content-changes");
const {
  getFileHash,
  isInterestingChangeType,
  addCheckSumToChange,
  moduleIsInterestingForDiff,
} = require("./utl");

/**
 * @param {string} pBaseDirectory
 * @returns {(pModule: import("../..").IModule) => import("../..").IModule}
 */
function addCheckSumToModule(pBaseDirectory) {
  return (pModule) => {
    if (moduleIsInterestingForDiff(pModule)) {
      return {
        ...pModule,
        checksum: getFileHash(join(pBaseDirectory, pModule.source)),
      };
    }
    return pModule;
  };
}

/**
 * @param {import("../..").IRevisionChange[]} pChanges
 * @param {import("../..").IModule[]} pModules
 * @returns {import("../..").IRevisionChange[]}
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

module.exports = class ContentStrategy {
  /**
   * @param {string} pDirectory
   * @param {import("../..").ICruiseResult} pCachedCruiseResult
   * @param {import("../../types/strict-options").IStrictCruiseOptions} pCruiseOptions
   * @param {Object} pOptions
   * @param {Set<string>} pOptions.extensions
   * @param {Set<import("watskeburt").changeTypeType>} pOptions.interestingChangeTypes
   * @param {string} pOptions.baseDir
   * @param {(pString:string) => Array<import("watskeburt").IChange>} pOptions.diffListFn
   * @param {(import("watskeburt").IChange) => import("../..").IRevisionChange} pOptions.checksumFn
   * @returns {import("../..").IRevisionData}
   */
  getRevisionData(pDirectory, pCachedCruiseResult, pCruiseOptions, pOptions) {
    const lOptions = {
      diffListFn: findContentChanges,
      checksumFn: addCheckSumToChange,
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
   * @param {import("../..").IRevisionData} pExistingRevisionData
   * @param {import("../..").IRevisionData} pNewRevisionData
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
   * @param {import("../..").ICruiseResult} pCruiseResult
   * @param {import("../..").IRevisionData} pRevisionData
   * @returns {import("../..").ICruiseResult}
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
};
