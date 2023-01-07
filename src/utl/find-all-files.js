const { readdirSync, statSync, readFileSync } = require("fs");
const { join } = require("path");
const ignore = require("ignore");
const pathToPosix = require("./path-to-posix");

/**
 * @param {string} pFullPathToFile
 * @param {string} pBaseDirectory
 * @returns {boolean}
 */
function fileIsDirectory(pFullPathToFile, pBaseDirectory) {
  try {
    const lStat = statSync(join(pBaseDirectory, pFullPathToFile));
    return lStat.isDirectory();
  } catch (pError) {
    return false;
  }
}

/**
 * @param {string} pDirectoryName
 * @param {{baseDir: string; ignoreFilterFn: (pString:string, pIndex: number, pArray: string[]) => boolean)}} pOptions
 * @returns {string[]}
 */
function walk(pDirectoryName, { baseDir, ignoreFilterFn }) {
  return readdirSync(join(baseDir, pDirectoryName))
    .map((pFileName) => join(pDirectoryName, pFileName))
    .filter(ignoreFilterFn)
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
          return pSum.concat(walk(fullPathToFile, { baseDir, ignoreFilterFn }));
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
 * @param {string} pDirectoryName
 * @param {{baseDir: string; ignoreFileContents?: string; additionalIgnorePatterns?: string[]}} pOptions
 * @returns {string[]}
 */
module.exports = function findAllFiles(
  pDirectoryName,
  { baseDir, ignoreFileContents, additionalIgnorePatterns }
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
  });
};
