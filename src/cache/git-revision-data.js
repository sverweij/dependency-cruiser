const { extname } = require("path");
const { getSHASync, listSync } = require("watskeburt");
const { objectsAreEqual, getFileHash } = require("./utl");

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
 *
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
    checksum: getFileHash(pChange.name),
  };
}

/**
 *
 * @param {Set<string>} pExtensions
 * @param {Set<import("watskeburt").changeTypeType>} pInterestingChangeTypes
 * @param {Object} pOptions
 * @param {() => string} pOptions.shaRetrievalFn
 * @param {(pString:string) => Array<import("watskeburt").IChange>} pOptions.diffListFn
 * @param {(import("watskeburt").IChange) => import("../..").IRevisionChange} pOptions.checkSumFn
 * @returns {import("../../types/dependency-cruiser").IRevisionData}
 */
function getRevisionData(
  pExtensions,
  pInterestingChangeTypes = DEFAULT_INTERESTING_CHANGE_TYPES,
  pOptions
) {
  const lOptions = {
    shaRetrievalFn: getSHASync,
    diffListFn: listSync,
    checkSumFn: addChecksum,
    ...pOptions,
  };
  try {
    const lSHA = lOptions.shaRetrievalFn();
    return {
      SHA1: lSHA,
      changes: lOptions
        .diffListFn(lSHA)
        .filter(hasInterestingExtension(pExtensions))
        .filter(isInterestingChangeType(pInterestingChangeTypes))
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
    objectsAreEqual(pExistingRevisionData.changes, pNewRevisionData.changes)
  );
}

module.exports = {
  getRevisionData,
  revisionDataEqual,
};
