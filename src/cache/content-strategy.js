const path = require("path");
const { isDeepStrictEqual } = require("util");
const { filenameMatchesPattern } = require("../graph-utl/match-facade");
const bus = require("../utl/bus");
const { DEBUG } = require("../utl/bus-log-levels");
const findAllFiles = require("../utl/find-all-files");
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
  return (pChange) => pExtensions.has(path.extname(pChange.name));
}

/**
 * @param {Set<import("watskeburt").changeTypeType>} pInterestingChangeTypes
 * @returns {(pChange: import("watskeburt").IChange) => boolean}
 */
function isInterestingChangeType(pInterestingChangeTypes) {
  return (pChange) => pInterestingChangeTypes.has(pChange.changeType);
}

/**
 * @param {import("watskeburt").IChange} pChange
 * @param {import("../..").IRevisionChange}
 */
function addCheckSumToChange(pChange) {
  return {
    ...pChange,
    checkSum: getFileHash(pChange.name),
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

function diffCachedModuleAgainstFileSet(
  pFileSet,
  pFileHashFunction = getFileHash
) {
  // eslint-disable-next-line complexity
  return (pModule) => {
    if (
      !pModule.consolidated &&
      !pModule.coreModule &&
      !pModule.couldNotResolve &&
      !pModule.matchesDoNotFollow
    ) {
      if (!pFileSet.has(pModule.source)) {
        return { name: pModule.source, changeType: "deleted" };
      }
      const lNewCheckSum = pFileHashFunction(pModule.source);
      if (lNewCheckSum !== pModule.checkSum) {
        return {
          name: pModule.source,
          changeType: "modified",
          checkSum: lNewCheckSum,
        };
      }
    }
    return {
      name: pModule.source,
      changeType: "unmodified",
      checkSum: pModule.checkSum,
    };
  };
}

/**
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
 * @returns {{source: string; changeType: import("watskeburt").changeTypeType; checkSum: string}[]}
 */
function findChanges(pDirectory, pCachedCruiseResult, pOptions) {
  bus.emit("progress", "cache: - hauling revision data", { level: DEBUG });
  const lFileSet = new Set(
    findAllFiles(pDirectory, {
      baseDir: pOptions.baseDir,
    })
      .filter(excludeFilter(pOptions.exclude))
      .filter(includeOnlyFilter(pOptions.includeOnly))
  );

  bus.emit("progress", "cache: - determining cached vs new", { level: DEBUG });
  const lDiffCachedVsNew = pCachedCruiseResult.modules.map(
    diffCachedModuleAgainstFileSet(lFileSet)
  );

  bus.emit("progress", "cache: - determining new vs cached", { level: DEBUG });
  lDiffCachedVsNew.forEach(({ name }) => lFileSet.delete(name));

  const lDiffNewVsCached = [];
  for (let lFileName of lFileSet) {
    lDiffNewVsCached.push({
      name: lFileName,
      changeType: "added",
      checkSum: getFileHash(lFileName),
    });
  }

  bus.emit("progress", "cache: - returning revision data", { level: DEBUG });
  return lDiffCachedVsNew
    .concat(lDiffNewVsCached)
    .filter(hasInterestingExtension(pOptions.extensions));
}

/**
 *
 * @param {string} pDirectory
 * @param {import("../..").ICruiseResult} pCachedCruiseResult
 * @param {import("../../types/strict-options").IStrictCruiseOptions} pCruiseOptions
 * @param {Object} pOptions
 * @param {Set<string>} pOptions.extensions
 * @param {Set<import("watskeburt").changeTypeType>} pOptions.interestingChangeTypes
 * @param {string} pOptions.baseDir
 * @param {(pString:string) => Array<import("watskeburt").IChange>} pOptions.diffListFn
 * @param {(import("watskeburt").IChange) => import("../..").IRevisionChange} pOptions.checkSumFn
 * @returns {import("../..").IRevisionData}
 */
function getRevisionData(
  pDirectory,
  pCachedCruiseResult,
  pCruiseOptions,
  pOptions
) {
  const lOptions = {
    diffListFn: findChanges,
    checkSumFn: addCheckSumToChange,
    interestingChangeTypes: DEFAULT_INTERESTING_CHANGE_TYPES,
    baseDir: process.cwd(),
    ...pOptions,
  };
  return {
    SHA1: "unknown-in-content-cache-strategy",
    changes: lOptions
      .diffListFn(pDirectory, pCachedCruiseResult, {
        baseDir: lOptions.baseDir,
        extensions: lOptions.extensions,
        includeOnly: pCruiseOptions.includeOnly,
        exclude: pCruiseOptions.exclude,
      })
      .filter(isInterestingChangeType(lOptions.interestingChangeTypes)),
  };
}

/**
 * @param {import("../..").IRevisionData} pExistingRevisionData
 * @param {import("../..").IRevisionData} pNewRevisionData
 * @returns {boolean}
 */
function revisionDataEqual(pExistingRevisionData, pNewRevisionData) {
  return (
    Boolean(pExistingRevisionData) &&
    Boolean(pNewRevisionData) &&
    isDeepStrictEqual(pExistingRevisionData.changes, pNewRevisionData.changes)
  );
}

/**
 * @param {import("../..").IModule} pModule
 * @param {import("../..").IRevisionChange}
 */
function addCheckSumToModule(pModule) {
  if (
    !pModule.consolidated &&
    !pModule.coreModule &&
    !pModule.couldNotResolve &&
    !pModule.matchesDoNotFollow
  ) {
    return {
      ...pModule,
      checkSum: getFileHash(pModule.source),
    };
  }
  return pModule;
}

/**
 * @param {import("../..").IRevisionChange[]} pChanges
 * @param {import("../..").IModule[]} pModules
 * @returns {import("../..").IRevisionChange[]}
 */
function refreshChanges(pChanges, pModules) {
  return pChanges.filter(
    (pChange) =>
      !pModules.some(
        (pModule) =>
          pModule.source === pChange.name &&
          pModule.checkSum === pChange.checkSum
      )
  );
}

function prepareRevisionDataForSaving(pCruiseResult, pRevisionData) {
  const lModules = pCruiseResult.modules.map(addCheckSumToModule);
  const lRevisionData = {
    ...pRevisionData,
    changes: refreshChanges(pRevisionData.changes, lModules),
  };

  return pRevisionData
    ? {
        ...pCruiseResult,
        modules: lModules,
        revisionData: lRevisionData,
      }
    : pCruiseResult;
}

module.exports = {
  getRevisionData,
  revisionDataEqual,
  prepareRevisionDataForSaving,
};
