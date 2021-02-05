const fs = require("fs");
const path = require("path");
const glob = require("glob");
const _get = require("lodash/get");
const filenameMatchesPattern = require("../graph-utl/match-facade")
  .filenameMatchesPattern;
const pathToPosix = require("./utl/path-to-posix");
const transpileMeta = require("./transpile/meta");

const SUPPORTED_EXTENSIONS = transpileMeta.scannableExtensions;

function shouldBeIncluded(pFullPathToFile, pOptions) {
  return (
    !_get(pOptions, "includeOnly.path") ||
    filenameMatchesPattern(pFullPathToFile, pOptions.includeOnly.path)
  );
}

function shouldNotBeExcluded(pFullPathToFile, pOptions) {
  return (
    (!_get(pOptions, "exclude.path") ||
      !filenameMatchesPattern(pFullPathToFile, pOptions.exclude.path)) &&
    (!_get(pOptions, "doNotFollow.path") ||
      !filenameMatchesPattern(pFullPathToFile, pOptions.doNotFollow.path))
  );
}

function gatherScannableFilesFromDirectory(pDirectoryName, pOptions) {
  return fs
    .readdirSync(path.join(pOptions.baseDir, pDirectoryName))
    .map((pFileName) => path.join(pDirectoryName, pFileName))
    .filter((pFullPathToFile) =>
      shouldNotBeExcluded(pathToPosix(pFullPathToFile), pOptions)
    )
    .reduce((pSum, pFullPathToFile) => {
      let lStat = {};
      try {
        lStat = fs.statSync(path.join(pOptions.baseDir, pFullPathToFile));
      } catch (pError) {
        return pSum;
      }
      if (lStat.isDirectory()) {
        return pSum.concat(
          gatherScannableFilesFromDirectory(pFullPathToFile, pOptions)
        );
      }
      if (
        SUPPORTED_EXTENSIONS.some((pExtension) =>
          pFullPathToFile.endsWith(pExtension)
        )
      ) {
        return pSum.concat(pFullPathToFile);
      }
      return pSum;
    }, [])
    .map((pFullPathToFile) => pathToPosix(pFullPathToFile))
    .filter((pFullPathToFile) => shouldBeIncluded(pFullPathToFile, pOptions));
}

/**
 * Returns an array of strings, representing paths to files to be gathered
 *
 * If an entry in the array passed is a (path to a) directory, it recursively
 * scans that directory for files with a scannable extension.
 * If an entry is a path to a file it just adds it.
 *
 * Files and directories are assumed to be either absolute, or relative to the
 * current working directory.
 *
 * @param  {array} pFileAndDirectoryArray an array of strings, representing globs and/ or
 *                               paths to files or directories to be gathered
 * @param  {object} pOptions     (optional) object with attributes
 *                               - exclude - regexp of what to exclude
 *                               - includeOnly - regexp what to exclude
 * @return {array}               an array of strings, representing paths to
 *                               files to be gathered.
 */
module.exports = (pFileAndDirectoryArray, pOptions) => {
  const lOptions = { baseDir: process.cwd(), ...pOptions };

  return pFileAndDirectoryArray
    .reduce(
      (pAll, pFileOrDirectory) =>
        pAll.concat(glob.sync(pFileOrDirectory, { cwd: lOptions.baseDir })),
      []
    )
    .reduce((pAll, pFileOrDirectory) => {
      if (
        fs.statSync(path.join(lOptions.baseDir, pFileOrDirectory)).isDirectory()
      ) {
        return pAll.concat(
          gatherScannableFilesFromDirectory(pFileOrDirectory, lOptions)
        );
      } else {
        return pAll.concat(pathToPosix(pFileOrDirectory));
      }
    }, []);
};
