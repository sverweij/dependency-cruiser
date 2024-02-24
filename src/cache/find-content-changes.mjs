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
// @ts-expect-error ts(2307) - the ts compiler is not privy to the existence of #imports in package.json
import { bus } from "#utl/bus.mjs";
// @ts-expect-error ts(2307) - the ts compiler is not privy to the existence of #imports in package.json
import findAllFiles from "#utl/find-all-files.mjs";

/**
 * @param {Set<string>} pFileSet
 * @param {typeof getFileHashSync} pFileHashFunction
 * @returns {(pModule:import("../..").IModule) => import('../..').IRevisionChange}
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
 * @param {import("../..").ICruiseResult} pCachedCruiseResult
 * @param {Object} pOptions
 * @param {Set<string>} pOptions.extensions
 * @param {string} pOptions.baseDir
 * @param {import("../../types/strict-filter-types.mjs").IStrictExcludeType} pOptions.exclude
 * @param {import("../../types/strict-filter-types.mjs").IStrictIncludeOnlyType=} pOptions.includeOnly
 * @returns {import("../..").IRevisionChange[]}
 */
export default function findContentChanges(
  pDirectory,
  pCachedCruiseResult,
  pOptions,
) {
  bus.debug("cache: - getting revision data");
  const lFileSet = new Set(
    findAllFiles(pDirectory, {
      baseDir: pOptions.baseDir,
      excludeFilterFn: excludeFilter(pOptions.exclude),
      includeOnlyFilterFn: includeOnlyFilter(pOptions.includeOnly),
    }).filter(hasInterestingExtension(pOptions.extensions)),
  );

  bus.debug("cache: - getting (cached - new)");
  const lDiffCachedVsNew = pCachedCruiseResult.modules.map(
    diffCachedModuleAgainstFileSet(lFileSet, pOptions.baseDir),
  );

  bus.debug("cache: - getting (new - cached)");
  lDiffCachedVsNew.forEach(({ name }) => lFileSet.delete(name));

  const lDiffNewVsCached = [];
  for (let lFileName of lFileSet) {
    lDiffNewVsCached.push({
      name: lFileName,
      type: /** @type import('watskeburt').changeType */ ("added"),
      checksum: getFileHashSync(join(pOptions.baseDir, lFileName)),
    });
  }

  bus.debug("cache: - returning revision data");
  return lDiffCachedVsNew.concat(lDiffNewVsCached);
}
