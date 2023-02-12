const { readdirSync, statSync, readFileSync } = require("fs");
const { join } = require("path");
const ignore = require("ignore");
const pathToPosix = require("./path-to-posix");

/**
 * @typedef {(pString:string, pIndex: number, pArray: string[]) => boolean} FilterFunctionType
 */

/**
 * @param {string} pFullPathToFile
 * @param {string} pBaseDirectory
 * @returns {boolean}
 */
function fileIsDirectory(pFullPathToFile, pBaseDirectory) {
  const lStat = statSync(join(pBaseDirectory, pFullPathToFile), {
    throwIfNoEntry: false,
  });
  return lStat?.isDirectory() ?? false;
}

/**
 * @param {string} pDirectoryName
 * @param {{baseDir: string; ignoreFilterFn: FilterFunctionType; excludeFilterFn: FilterFunctionType; includeOnlyFilterFn: FilterFunctionType}} pOptions
 * @returns {string[]}
 */
function walk(
  pDirectoryName,
  { baseDir, ignoreFilterFn, excludeFilterFn, includeOnlyFilterFn }
) {
  return readdirSync(join(baseDir, pDirectoryName))
    .map((pFileName) => join(pDirectoryName, pFileName))
    .filter(ignoreFilterFn)
    .filter(excludeFilterFn)
    .filter(includeOnlyFilterFn)
    .map((pFullPathToFile) => ({
      fullPathToFile: pFullPathToFile,
      isDirectory: fileIsDirectory(pFullPathToFile, baseDir),
    }))
    .reduce(
      /**
       * @param {string[]} pSum
       * @param {{fullPathToFile: string; isDirectory: boolean}} pCurrentValue
       * @returns {string[]}
       */
      (pSum, { fullPathToFile, isDirectory }) => {
        if (isDirectory) {
          return pSum.concat(
            walk(fullPathToFile, {
              baseDir,
              ignoreFilterFn,
              excludeFilterFn,
              includeOnlyFilterFn,
            })
          );
        }
        return pSum.concat(fullPathToFile);
      },
      []
    )
    .map((pFullPathToFile) => pathToPosix(pFullPathToFile));
}

function readIgnoreFile(pFileName) {
  try {
    return readFileSync(pFileName, "utf8");
  } catch (pError) {
    return "";
  }
}

/**
 * @type FilterFunctionType
 */
// eslint-disable-next-line no-unused-vars
function identityFilter(_pString, _pIndex, _pArray) {
  return true;
}

/**
 * @param {string} pDirectoryName
 * @param {{baseDir: string; ignoreFileContents?: string; additionalIgnorePatterns?: string[]; excludeFilterFn?: FilterFunctionType; includeOnlyFilterFn?: FilterFunctionType}} pOptions
 * @returns {string[]}
 */
module.exports = function findAllFiles(
  pDirectoryName,
  {
    baseDir,
    ignoreFileContents,
    additionalIgnorePatterns,
    excludeFilterFn,
    includeOnlyFilterFn,
  }
) {
  const lIgnoreFileContents =
    ignoreFileContents ?? readIgnoreFile(join(baseDir, ".gitignore"));
  const lAdditionalIgnorePatterns = additionalIgnorePatterns ?? [".git"];
  const lIgnoreFilterFunction = ignore()
    .add(lIgnoreFileContents)
    .add(lAdditionalIgnorePatterns)
    .createFilter();

  return walk(pDirectoryName, {
    baseDir,
    ignoreFilterFn: lIgnoreFilterFunction,
    excludeFilterFn: excludeFilterFn ?? identityFilter,
    includeOnlyFilterFn: includeOnlyFilterFn ?? identityFilter,
  });
};
