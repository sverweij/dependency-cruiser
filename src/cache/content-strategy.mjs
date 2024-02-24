/* eslint-disable no-inline-comments */
// @ts-check
import { isDeepStrictEqual } from "node:util";
import { join } from "node:path/posix";
import findContentChanges from "./find-content-changes.mjs";
import {
  getFileHashSync,
  isInterestingChangeType,
  moduleIsInterestingForDiff,
} from "./helpers.mjs";

/**
 * @typedef {import("../../types/dependency-cruiser.mjs").IModule} IModule
 * @typedef {import("../../types/dependency-cruiser.mjs").IRevisionChange} IRevisionChange
 * @typedef {import("../../types/dependency-cruiser.mjs").IRevisionData} IRevisionData
 * @typedef {import("../../types/dependency-cruiser.mjs").ICruiseResult} ICruiseResult
 * @typedef {import("../../types/strict-options.mjs").IStrictCruiseOptions} IStrictCruiseOptions
 */

/**
 * @param {string} pBaseDirectory
 * @returns {(IModule) => IModule}
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
 * @param {IRevisionChange[]} pChanges
 * @param {IModule[]} pModules
 * @returns {IRevisionChange[]}
 */
function refreshChanges(pChanges, pModules) {
  return pChanges.filter(
    (pChange) =>
      !pModules.some(
        (pModule) =>
          pModule.source === pChange.name &&
          pModule.checksum === pChange.checksum,
      ),
  );
}

export default class ContentStrategy {
  /**
   * @param {string} pDirectory
   * @param {ICruiseResult} pCachedCruiseResult
   * @param {IStrictCruiseOptions} pCruiseOptions
   * @param {Object} pOptions
   * @param {Set<string>} pOptions.extensions
   * @param {Set<import("watskeburt").changeType>=} pOptions.interestingChangeTypes?
   * @param {string=} pOptions.baseDir
   * @param {typeof findContentChanges=} pOptions.diffListFn
   * @param {typeof import('watskeburt').getSHA=} pOptions.checksumFn
   * @returns {IRevisionData}
   */
  getRevisionData(pDirectory, pCachedCruiseResult, pCruiseOptions, pOptions) {
    const lOptions = {
      diffListFn: findContentChanges,
      baseDir: process.cwd(),
      ...pOptions,
    };
    return {
      SHA1: "unknown-in-content-cache-strategy",
      changes: /** @type {IRevisionChange[]} */ (
        lOptions.diffListFn(pDirectory, pCachedCruiseResult, {
          baseDir: lOptions.baseDir,
          extensions: lOptions.extensions,
          includeOnly: pCruiseOptions.includeOnly,
          exclude: pCruiseOptions.exclude,
        })
      ).filter(isInterestingChangeType(lOptions.interestingChangeTypes)),
    };
  }

  /**
   * @param {IRevisionData=} pExistingRevisionData
   * @param {IRevisionData=} pNewRevisionData
   * @returns {boolean}
   */
  revisionDataEqual(pExistingRevisionData, pNewRevisionData) {
    return Boolean(
      pExistingRevisionData &&
        pNewRevisionData &&
        // Even though we don't really have a SHA1, it might be the previous version
        // of the cache did, e.g. because it was rendered with the metadata cache
        // strategy. In that case the SHA1 comparison is a reliable, fast bailout.
        pExistingRevisionData.SHA1 === pNewRevisionData.SHA1 &&
        isDeepStrictEqual(
          pExistingRevisionData.changes,
          pNewRevisionData.changes,
        ),
    );
  }

  /**
   * @param {ICruiseResult} pCruiseResult
   * @param {IRevisionData=} pRevisionData
   * @returns {ICruiseResult}
   */
  prepareRevisionDataForSaving(pCruiseResult, pRevisionData) {
    const lModulesWithCheckSum = pCruiseResult.modules.map(
      addCheckSumToModule(pCruiseResult.summary.optionsUsed.baseDir || "."),
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
