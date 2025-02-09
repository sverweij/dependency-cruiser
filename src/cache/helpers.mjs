// @ts-check
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { extname } from "node:path";
import memoize from "memoize";
import { filenameMatchesPattern } from "#graph-utl/match-facade.mjs";

/**
 * @import { IModule, IRevisionChange, } from "../../types/dependency-cruiser.mjs"
 * @import { IExcludeType } from "../../types/filter-types.mjs"
 * @import { IStrictIncludeOnlyType } from "../../types/strict-filter-types.mjs"
 * @import { changeType, IChange } from "watskeburt"
 */

/**
 * @param {string} pString
 * @returns {string}
 */
function hash(pString) {
  return createHash("sha1").update(pString).digest("base64");
}

/**
 * @param {string} pFileName
 * @returns {string}
 */
function _getFileHashSync(pFileName) {
  try {
    return hash(readFileSync(pFileName, "utf8"));
  } catch (pError) {
    return "file not found";
  }
}

export const getFileHashSync = memoize(_getFileHashSync);

/**
 * @param {IChange} pChange
 * @return {IRevisionChange}
 */
export function addCheckSumToChangeSync(pChange) {
  return {
    ...pChange,
    checksum: getFileHashSync(pChange.name),
  };
}

/**
 * @param {IExcludeType} pExcludeOption
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
 * @param {IStrictIncludeOnlyType=} pIncludeOnlyFilter
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
  return (pFileName) => pExtensions.has(extname(pFileName));
}

/**
 * @param {Set<string>} pExtensions
 * @returns {(pChange: IChange) => boolean}
 */
export function changeHasInterestingExtension(pExtensions) {
  return (pChange) => {
    const lNameHasInterestingExtension = hasInterestingExtension(pExtensions)(
      pChange.name,
    );
    const lOldNameHasInterestingExtension = Boolean(
      pChange.oldName && hasInterestingExtension(pExtensions)(pChange.oldName),
    );
    return lNameHasInterestingExtension || lOldNameHasInterestingExtension;
  };
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
 * @param {Set<changeType>=} pInterestingChangeTypes
 * @returns {(pChange: IChange) => boolean}
 */
export function isInterestingChangeType(pInterestingChangeTypes) {
  return (pChange) =>
    (pInterestingChangeTypes ?? DEFAULT_INTERESTING_CHANGE_TYPES).has(
      pChange.type,
    );
}

/**
 * @param {IModule} pModule
 * @returns {boolean}
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
