import { isDeepStrictEqual } from "node:util";
import { getSHASync, listSync } from "watskeburt";
import {
  isInterestingChangeType,
  addCheckSumToChange,
  excludeFilter,
  includeOnlyFilter,
  changeHasInterestingExtension,
} from "./helpers.mjs";

export default class MetaDataStrategy {
  /**
   * @param {Set<string>} pExtensions
   * @param {Set<import("watskeburt").changeTypeType>} pInterestingChangeTypes
   * @param {import("../../types/strict-options.js").IStrictCruiseOptions} pCruiseOptions
   * @param {Object} pOptions
   * @param {Set<string>} pOptions.extensions
   * @param {Set<import("watskeburt").changeTypeType>} pOptions.interestingChangeTypes
   * @param {() => string} pOptions.shaRetrievalFn
   * @param {(pString:string) => Array<import("watskeburt").IChange>} pOptions.diffListFn
   * @param {(import("watskeburt").IChange) => import("../..").IRevisionChange} pOptions.checksumFn
   * @returns {import("../../types/dependency-cruiser.js").IRevisionData}
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
        `The --cache option works in concert with git - and it seems either the current folder isn't version managed or git isn't installed. Error:${`\n\n          ${pError}\n`}`
      );
    }
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
    return pRevisionData
      ? {
          ...pCruiseResult,
          revisionData: pRevisionData,
        }
      : pCruiseResult;
  }
}
