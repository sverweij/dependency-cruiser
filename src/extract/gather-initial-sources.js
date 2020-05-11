const fs = require("fs");
const path = require("path");
const glob = require("glob");
const _get = require("lodash/get");
const filenameMatchesPattern = require("../utl/filename-matches-pattern");
const pathToPosix = require("../utl/path-to-posix");
const transpileMeta = require("./transpile/meta");

const SUPPORTED_EXTENSIONS = transpileMeta.scannableExtensions;

function keepNonExcluded(pFullPathToFile, pOptions) {
  return (
    (!_get(pOptions, "exclude.path") ||
      !filenameMatchesPattern(
        pathToPosix(pFullPathToFile),
        pOptions.exclude.path
      )) &&
    (!_get(pOptions, "includeOnly.path") ||
      filenameMatchesPattern(
        pathToPosix(pFullPathToFile),
        pOptions.includeOnly.path
      )) &&
    (!_get(pOptions, "doNotFollow.path") ||
      !filenameMatchesPattern(
        pathToPosix(pFullPathToFile),
        pOptions.doNotFollow.path
      ))
  );
}

function gatherScannableFilesFromDirectory(pDirectoryName, pOptions) {
  return fs
    .readdirSync(pDirectoryName)
    .reduce((pSum, pFileName) => {
      if (fs.statSync(path.join(pDirectoryName, pFileName)).isDirectory()) {
        return pSum.concat(
          gatherScannableFilesFromDirectory(
            path.join(pDirectoryName, pFileName),
            pOptions
          )
        );
      }
      if (
        SUPPORTED_EXTENSIONS.some((pExtension) =>
          pFileName.endsWith(pExtension)
        )
      ) {
        return pSum.concat(path.join(pDirectoryName, pFileName));
      }
      return pSum;
    }, [])
    .filter((pFullPathToFile) => keepNonExcluded(pFullPathToFile, pOptions));
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
      (pAll, pThis) => pAll.concat(glob.sync(pThis, { cwd: lOptions.baseDir })),
      []
    )
    .reduce((pAll, pThis) => {
      if (fs.statSync(path.join(lOptions.baseDir, pThis)).isDirectory()) {
        return pAll.concat(gatherScannableFilesFromDirectory(pThis, lOptions));
      } else {
        return pAll.concat(pThis);
      }
    }, []);
};
