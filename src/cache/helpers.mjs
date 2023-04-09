/* eslint-disable import/exports-last */
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import path from "node:path";
import memoize from "lodash/memoize.js";
import { filenameMatchesPattern } from "../graph-utl/match-facade.mjs";

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

export const getFileHash = memoize(_getFileHash);

/**
 * @param {import("watskeburt").IChange} pChange
 * @param {import("../../types/dependency-cruiser.js").IRevisionChange}
 */
export function addCheckSumToChange(pChange) {
  return {
    ...pChange,
    checksum: getFileHash(pChange.name),
  };
}

/**
 *
 * @param {import("../../types/strict-filter-types.js").IStrictExcludeType} pExcludeOption
 * @returns {(pFileName: string) => boolean}
 */
export function excludeFilter(pExcludeOption) {
  return (pFileName) => {
    if (pExcludeOption.path) {
      return !filenameMatchesPattern(pFileName, pExcludeOption.path);
    }
    return true;
  };
}

/**
 * @param {import("../../types/strict-filter-types.js").IStrictIncludeOnlyType} pIncludeOnlyFilter
 * @returns {(pFileName: string) => boolean}
 */
export function includeOnlyFilter(pIncludeOnlyFilter) {
  return (pFileName) => {
    if (pIncludeOnlyFilter) {
      return filenameMatchesPattern(pFileName, pIncludeOnlyFilter.path);
    }
    return true;
  };
}
/**
 * @param {Set<string>} pExtensions
 * @returns {(pFileName: string) => boolean}
 */
export function hasInterestingExtension(pExtensions) {
  return (pFileName) => pExtensions.has(path.extname(pFileName));
}

/**
 * @param {Set<string>} pExtensions
 * @returns {(pChange: import("watskeburt").IChange) => boolean}
 */
export function changeHasInterestingExtension(pExtensions) {
  return (pChange) =>
    hasInterestingExtension(pExtensions)(pChange.name) ||
    (pChange.oldName && hasInterestingExtension(pExtensions)(pChange.oldName));
}

// skipping: "pairing broken", "unmodified", "type changed", "ignored"
const DEFAULT_INTERESTING_CHANGE_TYPES = new Set([
  "added",
  "copied",
  "deleted",
  "modified",
  "renamed",
  "unmerged",
  "untracked",
]);

/**
 * @param {Set<import("watskeburt").changeTypeType>} pInterestingChangeTypes
 * @returns {(pChange: import("watskeburt").IChange) => boolean}
 */
export function isInterestingChangeType(pInterestingChangeTypes) {
  return (pChange) =>
    (pInterestingChangeTypes ?? DEFAULT_INTERESTING_CHANGE_TYPES).has(
      pChange.changeType
    );
}

/**
 * @param {pModule:import("../..").IModule} pModule
 */
export function moduleIsInterestingForDiff(pModule) {
  return (
    !pModule.consolidated &&
    !pModule.coreModule &&
    !pModule.couldNotResolve &&
    !pModule.matchesDoNotFollow &&
    // as followable is optional, !exists when the module _is_ followable
    // explicit comparison with false
    pModule.followable !== false
  );
}
