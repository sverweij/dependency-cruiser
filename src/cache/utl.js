const { createHash } = require("crypto");
const { readFileSync } = require("fs");
const path = require("path");
const memoize = require("lodash/memoize");
const { filenameMatchesPattern } = require("../graph-utl/match-facade");

/**
 * @param {string} pString
 * @returns {string}
 */
function hash(pString) {
  return createHash("sha1").update(pString).digest("base64");
}

/**
 * @param {import("fs").PathOrFileDescriptor} pFileName
 * @returns {string}
 */
function _getFileHash(pFileName) {
  try {
    return hash(readFileSync(pFileName, "utf8"));
  } catch (pError) {
    return "file not found";
  }
}

const getFileHash = memoize(_getFileHash);

/**
 * @param {import("watskeburt").IChange} pChange
 * @param {import("../..").IRevisionChange}
 */
function addCheckSumToChange(pChange) {
  return {
    ...pChange,
    checksum: getFileHash(pChange.name),
  };
}

/**
 *
 * @param {import("../../types/strict-filter-types").IStrictExcludeType} pExcludeOption
 * @returns {(pFileName: string) => boolean}
 */
function excludeFilter(pExcludeOption) {
  return (pFileName) => {
    if (pExcludeOption.path) {
      return !filenameMatchesPattern(pFileName, pExcludeOption.path);
    }
    return true;
  };
}

/**
 * @param {import("../../types/strict-filter-types").IStrictIncludeOnlyType} pIncludeOnlyFilter
 * @returns {(pFileName: string) => boolean}
 */
function includeOnlyFilter(pIncludeOnlyFilter) {
  return (pFileName) => {
    if (pIncludeOnlyFilter) {
      return filenameMatchesPattern(pFileName, pIncludeOnlyFilter.path);
    }
    return true;
  };
}

/**
 * @param {Set<string>} pExtensions
 * @returns {(pChange: import("watskeburt").IChange) => boolean}
 */
function hasInterestingExtension(pExtensions) {
  return (pChange) =>
    pExtensions.has(path.extname(pChange.name)) ||
    (pChange.oldName && pExtensions.has(path.extname(pChange.oldName)));
}

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
 * @param {Set<import("watskeburt").changeTypeType>} pInterestingChangeTypes
 * @returns {(pChange: import("watskeburt").IChange) => boolean}
 */
function isInterestingChangeType(pInterestingChangeTypes) {
  return (pChange) =>
    (pInterestingChangeTypes ?? DEFAULT_INTERESTING_CHANGE_TYPES).has(
      pChange.changeType
    );
}

module.exports = {
  getFileHash,
  excludeFilter,
  includeOnlyFilter,
  hasInterestingExtension,
  isInterestingChangeType,
  addCheckSumToChange,
};
