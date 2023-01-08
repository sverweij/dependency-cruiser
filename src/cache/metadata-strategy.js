const { extname } = require("path");
const { isDeepStrictEqual } = require("util");
const { getSHASync, listSync } = require("watskeburt");
const { getFileHash } = require("./utl");

// skipping: "pairing broken", "unmodified", "unmerged", "type changed"
const DEFAULT_INTERESTING_CHANGE_TYPES = new Set([
  "added",
  "copied",
  "deleted",
  "ignored",
  "modified",
  "renamed",
  "unmerged",
  "untracked",
]);

/**
 * @param {Set<string>} pExtensions
 * @returns {(pChange: import("watskeburt").IChange) => boolean}
 */
function hasInterestingExtension(pExtensions) {
  return (pChange) =>
    pExtensions.has(extname(pChange.name)) ||
    (pChange.oldName && pExtensions.has(extname(pChange.oldName)));
}

/**
 *
 * @param {Set<import("watskeburt").changeTypeType>} pInterestingChangeTypes
 * @returns {(pChange: import("watskeburt").IChange) => boolean}
 */
function isInterestingChangeType(pInterestingChangeTypes) {
  return (pChange) => pInterestingChangeTypes.has(pChange.changeType);
}

/**
 * @param {import("watskeburt").IChange} pChange
 * @param {import("../../types/dependency-cruiser").IRevisionChange}
 */
function addChecksum(pChange) {
  return {
    ...pChange,
    checkSum: getFileHash(pChange.name),
  };
}

/**
 *
 * @param {Set<string>} pExtensions
 * @param {Set<import("watskeburt").changeTypeType>} pInterestingChangeTypes
 * @param {import("../../types/strict-options").IStrictCruiseOptions} pCruiseOptions
 * @param {Object} pOptions
 * @param {Set<string>} pOptions.extensions
 * @param {Set<import("watskeburt").changeTypeType>} pOptions.interestingChangeTypes
 * @param {() => string} pOptions.shaRetrievalFn
 * @param {(pString:string) => Array<import("watskeburt").IChange>} pOptions.diffListFn
 * @param {(import("watskeburt").IChange) => import("../..").IRevisionChange} pOptions.checkSumFn
 * @returns {import("../../types/dependency-cruiser").IRevisionData}
 */
function getRevisionData(
  pDirectory,
  pCachedCruiseResult,
  pCruiseOptions,
  pOptions
) {
  const lOptions = {
    shaRetrievalFn: getSHASync,
    diffListFn: listSync,
    checkSumFn: addChecksum,
    interestingChangeTypes: DEFAULT_INTERESTING_CHANGE_TYPES,
    ...pOptions,
  };
  try {
    const lSHA = lOptions.shaRetrievalFn();
    return {
      SHA1: lSHA,
      changes: lOptions
        .diffListFn(lSHA)
        // TODO: optimize - also apply filters for exclude and includeOnly (see content strategy)
        .filter(hasInterestingExtension(lOptions.extensions))
        .filter(isInterestingChangeType(lOptions.interestingChangeTypes))
        .map(lOptions.checkSumFn),
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
 * @param {import("../../types/dependency-cruiser").IRevisionData} pExistingRevisionData
 * @param {import("../../types/dependency-cruiser").IRevisionData} pNewRevisionData
 * @returns {boolean}
 */
function revisionDataEqual(pExistingRevisionData, pNewRevisionData) {
  return (
    Boolean(pExistingRevisionData) &&
    Boolean(pNewRevisionData) &&
    pExistingRevisionData.SHA1 === pNewRevisionData.SHA1 &&
    isDeepStrictEqual(pExistingRevisionData.changes, pNewRevisionData.changes)
  );
}

/**
 *
 * @param {import("../..").ICruiseResult} pCruiseResult
 * @param {*} pRevisionData
 * @returns {import("../..").ICruiseResult}
 */
function prepareRevisionDataForSaving(pCruiseResult, pRevisionData) {
  return pRevisionData
    ? {
        ...pCruiseResult,
        revisionData: pRevisionData,
      }
    : pCruiseResult;
}

module.exports = {
  getRevisionData,
  revisionDataEqual,
  prepareRevisionDataForSaving,
};
