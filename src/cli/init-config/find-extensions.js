// @ts-check
/* eslint-disable security/detect-object-injection */
const fs = require("fs");
const path = require("path");
const pathToPosix = require("../../utl/path-to-posix");
const getExtension = require("../../utl/get-extension.js");
const meta = require("../../extract/transpile/meta");

/**
 * @param {string[]} pIgnorablePathElements
 * @returns {(string) => boolean}
 */
function notIgnorable(pIgnorablePathElements) {
  return (pPath) => {
    return !pIgnorablePathElements.includes(pPath);
  };
}

/**
 * @param {string} pFullPathToFile
 * @param {string} pBaseDirectory
 * @returns {boolean}
 */
function fileIsDirectory(pFullPathToFile, pBaseDirectory) {
  try {
    const lStat = fs.statSync(path.join(pBaseDirectory, pFullPathToFile));
    return lStat.isDirectory();
  } catch (pError) {
    return false;
  }
}

/**
 * @param {string} pDirectoryName
 * @param {{baseDir: string; ignorablePathElements: string[]}} pOptions
 * @returns {string[]}
 */
function listAllModules(pDirectoryName, { baseDir, ignorablePathElements }) {
  return fs
    .readdirSync(path.join(baseDir, pDirectoryName))
    .filter(notIgnorable(ignorablePathElements))
    .map((pFileName) => path.join(pDirectoryName, pFileName))
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
            listAllModules(fullPathToFile, { baseDir, ignorablePathElements })
          );
        }
        return pSum.concat(fullPathToFile);
      },
      []
    )
    .map((pFullPathToFile) => pathToPosix(pFullPathToFile));
}

/**
 * @param {Record<string,number>} pAll
 * @param {string} pExtension
 */
function reduceToCounts(pAll, pExtension) {
  if (pAll[pExtension]) {
    pAll[pExtension] += 1;
  } else {
    pAll[pExtension] = 1;
  }
  return pAll;
}

function compareByCount(pCountsObject) {
  return function compare(pLeft, pRight) {
    return pCountsObject[pRight] - pCountsObject[pLeft];
  };
}

/**
 * @param {string[]} pDirectories
 * @param {{baseDir?: string; ignorablePathElements?: string[], scannableExtensions?: string[]}=} pOptions
 * @returns {string[]}
 */
module.exports = function findExtensions(pDirectories, pOptions) {
  const lOptions = {
    baseDir: process.cwd(),
    ignorablePathElements: [
      ".git",
      ".husky",
      ".vscode",
      "coverage",
      "node_nodules",
      "nyc",
    ],
    scannableExtensions: meta.scannableExtensions,
    ...pOptions,
  };

  const lExtensionsWithCounts = pDirectories
    .flatMap((pDirectory) =>
      listAllModules(pDirectory, lOptions).map(getExtension).filter(Boolean)
    )
    .reduce(reduceToCounts, {});

  return Object.keys(lExtensionsWithCounts)
    .filter((pExtension) => lOptions.scannableExtensions.includes(pExtension))
    .sort(compareByCount(lExtensionsWithCounts));
};
