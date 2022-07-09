const { deepEqual } = require("assert");
const { createHash } = require("crypto");
const { readFileSync, mkdirSync, writeFileSync } = require("fs");
const { extname, join } = require("path");
const memoize = require("lodash/memoize");
const { getSHA, list } = require("watskeburt");

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
 * @param {import("watskeburt").changeTypeType[]} pInterestingChangeTypes
 * @returns {(pChange: import("watskeburt").IChange) => boolean}
 */
function isInterestingChangeType(pInterestingChangeTypes) {
  return (pChange) => pInterestingChangeTypes.includes(pChange.changeType);
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
 * @param {import("watskeburt").changeTypeType[]} pInterestingChangeTypes
 * @returns {import("../../types/cruise-result").IRevisionData}
 */
function getRevisionData(
  pExtensions,
  pArguments,
  pRulesFile,
  // skipping: "pairing broken", "unmodified", "unmerged", "type changed"
  pInterestingChangeTypes = [
    "added",
    "copied",
    "deleted",
    "ignored",
    "modified",
    "renamed",
    "unmerged",
    "untracked",
  ]
) {
  try {
    const lSHA = getSHA();
    return {
      SHA1: lSHA,
      changes: list(lSHA)
        .filter(hasInterestingExtension(pExtensions))
        .filter(isInterestingChangeType(pInterestingChangeTypes))
        .map(addChecksum),
      args: pArguments,
      rulesFile: pRulesFile,
    };
  } catch (pError) {
    return {};
  }
}
/**
 *
 * @param {import("watskeburt").IChange[]} pExistingChanges
 * @param {import("watskeburt").IChange[]} pNewChanges
 */
function changesAreSame(pExistingChanges, pNewChanges) {
  try {
    deepEqual(pExistingChanges, pNewChanges);
    return true;
  } catch (pError) {
    return false;
  }
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
 * @param {import("../../types/cruise-result").IRevisionData} pExistingRevisionData
 * @param {import("../../types/cruise-result").IRevisionData} pNewRevisionData
 * @returns {boolean}
 */
function revisionDataEqual(pExistingRevisionData, pNewRevisionData) {
  return (
    pExistingRevisionData &&
    pNewRevisionData &&
    pExistingRevisionData.SHA1 === pNewRevisionData.SHA1 &&
    pExistingRevisionData.rulesFile === pNewRevisionData.rulesFile &&
    pNewRevisionData.args.every((pArgument) =>
      pExistingRevisionData.args.includes(pArgument)
    ) &&
    changesAreSame(pExistingRevisionData.changes, pNewRevisionData.changes)
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

function canServeFromCache(pCacheFolder, pRevisionData) {
  const lCachedResults = readCache(pCacheFolder);
  return revisionDataEqual(lCachedResults.revisionData, pRevisionData);
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
