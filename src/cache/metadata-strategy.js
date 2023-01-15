const { isDeepStrictEqual } = require("util");
const { getSHASync, listSync } = require("watskeburt");
const {
  isInterestingChangeType,
  addCheckSumToChange,
  excludeFilter,
  includeOnlyFilter,
  changeHasInterestingExtension,
} = require("./utl");

module.exports = class MetaDataStrategy {
  /**
   * @param {Set<string>} pExtensions
   * @param {Set<import("watskeburt").changeTypeType>} pInterestingChangeTypes
   * @param {import("../../types/strict-options").IStrictCruiseOptions} pCruiseOptions
   * @param {Object} pOptions
   * @param {Set<string>} pOptions.extensions
   * @param {Set<import("watskeburt").changeTypeType>} pOptions.interestingChangeTypes
   * @param {() => string} pOptions.shaRetrievalFn
   * @param {(pString:string) => Array<import("watskeburt").IChange>} pOptions.diffListFn
   * @param {(import("watskeburt").IChange) => import("../..").IRevisionChange} pOptions.checksumFn
   * @returns {import("../..").IRevisionData}
   */
  getRevisionData(pDirectory, pCachedCruiseResult, pCruiseOptions, pOptions) {
    const lOptions = {
      shaRetrievalFn: getSHASync,
      diffListFn: listSync,
      checksumFn: addCheckSumToChange,
      ...pOptions,
    };
    try {
      const lSHA = lOptions.shaRetrievalFn();
      return {
        SHA1: lSHA,
        changes: lOptions
          .diffListFn(lSHA)
          .filter(({ name }) => excludeFilter(pCruiseOptions.exclude)(name))
          .filter(({ name }) =>
            includeOnlyFilter(pCruiseOptions.includeOnly)(name)
          )
          .filter(changeHasInterestingExtension(lOptions.extensions))
          .filter(isInterestingChangeType(lOptions.interestingChangeTypes))
          .map(lOptions.checksumFn),
      };
    } catch (pError) {
      throw new Error(
        "The --cache option works in concert with git - and it seems either the " +
          "current folder isn't version managed or git isn't installed. Error:" +
          `\n\n          ${pError}\n`
      );
    }
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
    return pRevisionData
      ? {
          ...pCruiseResult,
          revisionData: pRevisionData,
        }
      : pCruiseResult;
  }
};
