import { readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { glob } from "glob";
import { filenameMatchesPattern } from "../graph-utl/match-facade.mjs";
import getExtension from "../utl/get-extension.mjs";
import pathToPosix from "../utl/path-to-posix.mjs";
import { scannableExtensions } from "./transpile/meta.mjs";

/**
 *
 * @param {import('../../types/options.js').IStrictCruiseOptions} pOptions
 * @returns {string[]}
 */
function getScannableExtensions(pOptions) {
  return scannableExtensions.concat(pOptions.extraExtensionsToScan);
}

function fileIsScannable(pOptions, pPathToFile) {
  return getScannableExtensions(pOptions).includes(getExtension(pPathToFile));
}

function shouldBeIncluded(pFullPathToFile, pOptions) {
  return (
    !pOptions?.includeOnly?.path ||
    filenameMatchesPattern(pFullPathToFile, pOptions.includeOnly.path)
  );
}

function shouldNotBeExcluded(pFullPathToFile, pOptions) {
  return (
    (!pOptions?.exclude?.path ||
      !filenameMatchesPattern(pFullPathToFile, pOptions.exclude.path)) &&
    (!pOptions?.doNotFollow?.path ||
      !filenameMatchesPattern(pFullPathToFile, pOptions.doNotFollow.path))
  );
}

/**
 *
 * @param {string} pDirectoryName
 * @param  {import('../../types/options.js').IStrictCruiseOptions} pOptions options that
 * @returns {string[]}
 */
function gatherScannableFilesFromDirectory(pDirectoryName, pOptions) {
  return readdirSync(join(pOptions.baseDir, pDirectoryName))
    .map((pFileName) => join(pDirectoryName, pFileName))
    .filter((pFullPathToFile) =>
      shouldNotBeExcluded(pathToPosix(pFullPathToFile), pOptions)
    )
    .reduce((pSum, pFullPathToFile) => {
      let lStat = statSync(join(pOptions.baseDir, pFullPathToFile), {
        throwIfNoEntry: false,
      });

      if (lStat) {
        if (lStat.isDirectory()) {
          return pSum.concat(
            gatherScannableFilesFromDirectory(pFullPathToFile, pOptions)
          );
        }
        if (fileIsScannable(pOptions, pFullPathToFile)) {
          return pSum.concat(pFullPathToFile);
        }
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
 * @param  {string[]} pFileAndDirectoryArray globs and/ or paths to files or
 *                               directories to be gathered
 * @param  {import('../../types/dependency-cruiser.js').IStrictCruiseOptions} pOptions options that
 *                               influence what needs to be gathered/ scanned
 *                               notably useful attributes:
 *                               - exclude - regexp of what to exclude
 *                               - includeOnly - regexp what to include
 * @return {string[]}            paths to files to be gathered.
 */
export default function gatherInitialSources(pFileAndDirectoryArray, pOptions) {
  const lOptions = { baseDir: process.cwd(), ...pOptions };

  // these are `.reduce`s and not `.map`s because they typically return larger
  // arrays than the pFileAndDirectoryArray:
  // - `glob` returns an array of strings
  // - so does `gatherScannableFilesFromDirectory`
  return pFileAndDirectoryArray
    .reduce(
      (pAll, pFileOrDirectory) =>
        pAll.concat(
          glob.sync(pathToPosix(pFileOrDirectory), {
            cwd: pathToPosix(lOptions.baseDir),
          })
        ),
      []
    )
    .reduce((pAll, pFileOrDirectory) => {
      if (statSync(join(lOptions.baseDir, pFileOrDirectory)).isDirectory()) {
        return pAll.concat(
          gatherScannableFilesFromDirectory(pFileOrDirectory, lOptions)
        );
      } else {
        return pAll.concat(pathToPosix(pFileOrDirectory));
      }
    }, [])
    .sort();
}
