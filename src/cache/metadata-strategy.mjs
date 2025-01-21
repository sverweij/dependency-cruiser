/* eslint-disable no-inline-comments */
// @ts-check
import { isDeepStrictEqual } from "node:util";
import { getSHA, list } from "watskeburt";
import {
  isInterestingChangeType,
  addCheckSumToChangeSync,
  excludeFilter,
  includeOnlyFilter,
  changeHasInterestingExtension,
} from "./helpers.mjs";
import { bus } from "#utl/bus.mjs";

/**
 * @import {IModule, IRevisionChange, IRevisionData, ICruiseResult } from "../../types/dependency-cruiser.mjs"
 * @import { IStrictCruiseOptions } from "../../types/strict-options.mjs"
 * @import { changeType, IChange } from "watskeburt"
 */

export default class MetaDataStrategy {
  /**
   * @param {string} _pDirectory
   * @param {ICruiseResult} _pCachedCruiseResult
   * @param {Object} pOptions
   * @param {Set<string>} pOptions.extensions
   * @param {Set<changeType>=} pOptions.interestingChangeTypes
   * @param {typeof getSHA=} pOptions.shaRetrievalFn
   * @param {typeof list=} pOptions.diffListFn
   * @param {typeof addCheckSumToChangeSync=} pOptions.checksumFn
   * @returns {Promise<IRevisionData>}
   */
  async getRevisionData(
    _pDirectory,
    _pCachedCruiseResult,
    pCruiseOptions,
    pOptions,
  ) {
    const lOptions = {
      shaRetrievalFn: getSHA,
      diffListFn: list,
      checksumFn: addCheckSumToChangeSync,
      ...pOptions,
    };
    try {
      bus.debug("cache: - get sha");
      const lSHA = await lOptions.shaRetrievalFn();
      bus.debug("cache: - get diff");
      const lDiff = /** @type {IChange[]} */ (
        await lOptions.diffListFn({ oldRevision: lSHA })
      );
      const lChanges = lDiff
        .filter(({ name }) => excludeFilter(pCruiseOptions.exclude)(name))
        .filter(({ name }) =>
          includeOnlyFilter(pCruiseOptions.includeOnly)(name),
        )
        .filter(changeHasInterestingExtension(lOptions.extensions))
        .filter(isInterestingChangeType(lOptions.interestingChangeTypes));
      bus.debug("cache: - sha-sum diff");
      return {
        SHA1: lSHA,
        changes: lChanges.map(lOptions.checksumFn),
      };
    } catch (pError) {
      throw new Error(
        `The --cache option works in concert with git - and it seems either the current folder isn't version managed or git isn't installed. Error:${`\n\n          ${pError}\n`}`,
      );
    }
  }

  /**
   * @param {IRevisionData=} pExistingRevisionData
   * @param {IRevisionData=} pNewRevisionData
   * @returns {boolean}
   */
  revisionDataEqual(pExistingRevisionData, pNewRevisionData) {
    return (
      Boolean(pExistingRevisionData) &&
      Boolean(pNewRevisionData) &&
      // @ts-expect-error ts(18048) - tsc complains pExistingRevisionData &
      // pNewRevisionData can be undefined, but it should probably get a course
      // in reading typescript as we've just checked this.
      pExistingRevisionData.SHA1 === pNewRevisionData.SHA1 &&
      // @ts-expect-error ts(18048)
      isDeepStrictEqual(pExistingRevisionData.changes, pNewRevisionData.changes)
    );
  }

  /**
   * @param {ICruiseResult} pCruiseResult
   * @param {IRevisionData=} pRevisionData
   * @returns {ICruiseResult}
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
