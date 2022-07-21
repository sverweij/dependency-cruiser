const { deepEqual } = require("assert");
const { createHash } = require("crypto");
const { readFileSync, mkdirSync, writeFileSync } = require("fs");
const { extname, join } = require("path");
const memoize = require("lodash/memoize");
const { getSHASync, listSync } = require("watskeburt");

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
 * @param {string[]} pExtensions
 * @returns {(pChange: import("watskeburt").IChange) => boolean}
 */
function hasInterestingExtension(pExtensions) {
  return (pChange) =>
    pExtensions.includes(extname(pChange.name)) ||
    (pChange.oldName && pExtensions.includes(extname(pChange.oldName)));
}

/**
 *
 * @param {Set<import("watskeburt").changeTypeType>} pInterestingChangeTypes
 * @returns {(pChange: import("watskeburt").IChange) => boolean}
 */
function isInterestingChangeType(pInterestingChangeTypes) {
  return (pChange) => pInterestingChangeTypes.has(pChange.changeType);
}

function hash(pString) {
  return createHash("sha1").update(pString).digest("base64");
}

/**
 * @param {import("watskeburt").IChange} pChange
 */
function addChecksum(pChange) {
  const lReturnValue = {
    ...pChange,
    checksum: hash(readFileSync(pChange.name, "utf-8")),
  };
  return lReturnValue;
}

/**
 *
 * @param {string[]} pExtensions
 * @param {string[]} pArguments,
 * @param {import("../../types/strict-options").IStrictCruiseOptions} pOptions
 * @param {Set<import("watskeburt").changeTypeType>} pInterestingChangeTypes
 * @returns {import("../../types/cruise-result").IRevisionData}
 */
function getRevisionData(
  pExtensions,
  pInterestingChangeTypes = DEFAULT_INTERESTING_CHANGE_TYPES,
  pSHA = getSHASync(),
  pList = listSync(pSHA)
) {
  try {
    return {
      SHA1: pSHA,
      changes: pList
        .filter(hasInterestingExtension(pExtensions))
        .filter(isInterestingChangeType(pInterestingChangeTypes))
        .map(addChecksum),
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
 *
 * @param {any} pLeftObject
 * @param {any} pRightObject
 */
function objectsAreEqual(pLeftObject, pRightObject) {
  try {
    deepEqual(pLeftObject, pRightObject);
    return true;
  } catch (pError) {
    return false;
  }
}

/**
 *
 * @param {import("../../types/cruise-result").IRevisionData} pExistingRevisionData
 * @param {import("../../types/cruise-result").IRevisionData} pNewRevisionData
 * @returns {boolean}
 */
function revisionDataEqual(pExistingRevisionData, pNewRevisionData) {
  return (
    pExistingRevisionData &&
    pNewRevisionData &&
    pExistingRevisionData.SHA1 === pNewRevisionData.SHA1 &&
    objectsAreEqual(pExistingRevisionData.changes, pNewRevisionData.changes)
  );
}

function includeOnlyFiltersAreCompatible(pExistingFilter, pNewFilter) {
  return (
    !pExistingFilter || objectsAreEqual({ path: pExistingFilter }, pNewFilter)
  );
}
function filtersAreCompatible(pExistingFilter, pNewFilter) {
  return !pExistingFilter || objectsAreEqual(pExistingFilter, pNewFilter);
}

function limitsAreCompatible(pExistingLimit, pNewLimit) {
  return !pExistingLimit || pExistingLimit >= (pNewLimit || pExistingLimit + 1);
}
/*
## No influence on cache
  -i, --info                  
  -V, --version               
  -h, --help         
  -T, --output-type <type>    unless counting implicit shizzle like dependendents, metrics calculation
  -f, --output-to <file>      
  -p, --progress [type]       
  -P, --prefix <prefix>       
  -C, --cache [cache-location]
 --init [oneshot]             


## Influence on cache
### 100% invalidate when different
  -c, --config [file]         
  --ignore-known [file]       
  --ts-config [file]          
  --webpack-config [file]     
  --ts-pre-compilation-deps   
  -v, --validate [file]       
  --preserve-symlinks         

### Invalidates when in cache, not in command 
(or more precise: when filters in cache yield a subset of command)
  -I, --include-only <regex>  
  -F, --focus <regex>         
  -x, --exclude <regex>       
  -X, --do-not-follow <regex> 
  -S, --collapse <regex>      
  -d, --max-depth <n>          (more precise: when cache.max-depth < command.max-depth OR cache.max-depth === 0)
  -M, --module-systems <items> (more precise: )

### Invalidates when not in cache, but in command
  -m, --metrics               
*/
/**
 *
 * @param {import("../../types/strict-options").IStrictCruiseOptions} pExistingOptions
 * @param {import("../../types/strict-options").IStrictCruiseOptions} pNewOptions
 * @returns {boolean}
 */
// eslint-disable-next-line complexity
function optionsCompatible(pExistingOptions, pNewOptions) {
  return (
    pExistingOptions.args === pNewOptions.args &&
    pExistingOptions.rulesFile === pNewOptions.rulesFile &&
    pExistingOptions.tsPreCompilationDeps ===
      pNewOptions.tsPreCompilationDeps &&
    // includeOnly suffers from a backwards compatibility disease
    includeOnlyFiltersAreCompatible(
      pExistingOptions.includeOnly,
      pNewOptions.includeOnly
    ) &&
    filtersAreCompatible(pExistingOptions.focus, pNewOptions.focus) &&
    filtersAreCompatible(pExistingOptions.exclude, pNewOptions.exclude) &&
    filtersAreCompatible(
      pExistingOptions.doNotFollow,
      pNewOptions.doNotFollow
    ) &&
    filtersAreCompatible(pExistingOptions.collapse, pNewOptions.collapse) &&
    limitsAreCompatible(pExistingOptions.maxDepth, pNewOptions.maxDepth) &&
    filtersAreCompatible(
      pExistingOptions.moduleSystems,
      pNewOptions.moduleSystems
    )
  );
}

function _readCache(pCacheFolder) {
  try {
    return JSON.parse(readFileSync(join(pCacheFolder, "cache.json"), "utf-8"));
  } catch (pError) {
    return { modules: [], summary: {} };
  }
}

const readCache = memoize(_readCache);

/**
 *
 * @param {import("../../types/strict-options").IStrictCruiseOptions} pOptions
 * @param {import("../../types/cruise-result").IRevisionData} pRevisionData
 * @returns
 */
function canServeFromCache(pOptions, pRevisionData) {
  /** @type {import("../../types/cruise-result").ICruiseResult} */
  const lCachedResults = readCache(pOptions.cache);
  return (
    revisionDataEqual(lCachedResults.revisionData, pRevisionData) &&
    optionsCompatible(lCachedResults.summary.optionsUsed, pOptions)
  );
}

function writeCache(pCacheFolder, pCruiseResult) {
  mkdirSync(pCacheFolder, { recursive: true });
  writeFileSync(
    join(pCacheFolder, "cache.json"),
    JSON.stringify(pCruiseResult),
    "utf-8"
  );
}

module.exports = {
  getRevisionData,
  revisionDataEqual,
  canServeFromCache,
  readCache,
  writeCache,
};
