/* eslint-disable no-inline-comments */
// @ts-check
import { join } from "node:path/posix";
import {
  getFileHashSync,
  excludeFilter,
  includeOnlyFilter,
  hasInterestingExtension,
  moduleIsInterestingForDiff,
} from "./helpers.mjs";
import { bus } from "#utl/bus.mjs";
import findAllFiles from "#utl/find-all-files.mjs";

/**
 * @import { IModule, IRevisionChange } from "../../types/dependency-cruiser.mjs"
 * @import { ICruiseResult } from "../../types/cruise-result.mjs"
 * @import { IStrictExcludeType, IStrictIncludeOnlyType } from "../../types/strict-filter-types.mjs"
 */

/**
 * @param {Set<string>} pFileSet
 * @param {typeof getFileHashSync} pFileHashFunction
 * @returns {(pModule:IModule) => IRevisionChange}
 */
function diffCachedModuleAgainstFileSet(
  pFileSet,
  pBaseDirectory,
  pFileHashFunction = getFileHashSync,
) {
  return (pModule) => {
    if (!moduleIsInterestingForDiff(pModule)) {
      return { name: pModule.source, type: "ignored" };
    }

    if (!pFileSet.has(pModule.source)) {
      return { name: pModule.source, type: "deleted" };
    }

    const lNewCheckSum = pFileHashFunction(
      join(pBaseDirectory, pModule.source),
    );
    if (lNewCheckSum !== pModule.checksum) {
      return {
        name: pModule.source,
        type: "modified",
        checksum: lNewCheckSum,
      };
    }

    return {
      name: pModule.source,
      type: "unmodified",
      checksum: pModule.checksum,
    };
  };
}

/**
  We can run into these scenarios:
  - there is no cache yet:
    modules will === []; all files will be marked as 'added'
  - there is a cache and it contains checksums:
    - existing files that are not in the cache => added
    - modules that are in the cache:
      - don't exist anymore => deleted TODO: 
        we might wrongly bump into this for files that are gitignored and that don't have an interesting extension
      - cached checksum === current checksum => not a change; left out
      - cached checksum !== current checksum => modified
  - there is a cache, but it doesn't contain checksums => same as before, except
    all files will be marked as 'modified'
 * @param {string} pDirectory
 * @param {ICruiseResult} pCachedCruiseResult
 * @param {Object} pOptions
 * @param {Set<string>} pOptions.extensions
 * @param {string} pOptions.baseDir
 * @param {IStrictExcludeType} pOptions.exclude
 * @param {IStrictIncludeOnlyType=} pOptions.includeOnly
 * @returns {IRevisionChange[]}
 */
export default function findContentChanges(
  pDirectory,
  pCachedCruiseResult,
  pOptions,
) {
  bus.debug("cache: - get revision data");
  const lFileSet = new Set(
    findAllFiles(pDirectory, {
      baseDir: pOptions.baseDir,
      excludeFilterFn: excludeFilter(pOptions.exclude),
      includeOnlyFilterFn: includeOnlyFilter(pOptions.includeOnly),
    }).filter(hasInterestingExtension(pOptions.extensions)),
  );

  bus.debug("cache: - get (cached - new)");
  const lDiffCachedVsNew = pCachedCruiseResult.modules.map(
    diffCachedModuleAgainstFileSet(lFileSet, pOptions.baseDir),
  );

  bus.debug("cache: - get (new - cached)");
  lDiffCachedVsNew.forEach(({ name }) => lFileSet.delete(name));

  const lDiffNewVsCached = [];
  for (let lFileName of lFileSet) {
    lDiffNewVsCached.push({
      name: lFileName,
      type: /** @type import('watskeburt').changeType */ ("added"),
      checksum: getFileHashSync(join(pOptions.baseDir, lFileName)),
    });
  }

  bus.debug("cache: - return revision data");
  return lDiffCachedVsNew.concat(lDiffNewVsCached);
}
