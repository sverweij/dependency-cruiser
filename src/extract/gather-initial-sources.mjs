import { readdirSync, statSync } from "node:fs";
import { join, normalize } from "node:path";
import picomatch from "picomatch";
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
      shouldNotBeExcluded(pathToPosix(pFullPathToFile), pOptions),
    )
    .reduce((pSum, pFullPathToFile) => {
      let lStat = statSync(join(pOptions.baseDir, pFullPathToFile), {
        throwIfNoEntry: false,
      });

      if (lStat) {
        if (lStat.isDirectory()) {
          return pSum.concat(
            gatherScannableFilesFromDirectory(pFullPathToFile, pOptions),
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

function doMagic(pAllFiles, pGlob) {
  const isMatch = picomatch(pGlob);
  return pAllFiles.filter((pFile) => isMatch(pFile));
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
 * @param  {string[]} pFileDirectoryAndGlobArray globs and/ or paths to files or
 *                               directories to be gathered
 * @param  {import('../../types/dependency-cruiser.js').IStrictCruiseOptions} pOptions options that
 *                               influence what needs to be gathered/ scanned
 *                               notably useful attributes:
 *                               - exclude - regexp of what to exclude
 *                               - includeOnly - regexp what to include
 * @return {string[]}            paths to files to be gathered.
 */
export default function gatherInitialSources(
  pFileDirectoryAndGlobArray,
  pOptions,
) {
  const lOptions = { baseDir: process.cwd(), ...pOptions };
  let lAllFiles = [];

  return pFileDirectoryAndGlobArray
    .flatMap((pFileDirectoryOrGlob) => {
      const lScannedGlob = picomatch.scan(pFileDirectoryOrGlob);
      if (lScannedGlob.isGlob) {
        lAllFiles = readdirSync(join(lOptions.baseDir, lScannedGlob.base), {
          recursive: true,
        });
        return doMagic(lAllFiles, pathToPosix(lScannedGlob.glob)).map((pFile) =>
          pathToPosix(join(lScannedGlob.base, pFile)),
        );
      }
      return pathToPosix(normalize(pFileDirectoryOrGlob));
    })
    .flatMap((pFileOrDirectory) => {
      if (statSync(join(lOptions.baseDir, pFileOrDirectory)).isDirectory()) {
        return gatherScannableFilesFromDirectory(pFileOrDirectory, lOptions);
      }
      // Not a glob anymore, and not a directory => it's a file
      return pathToPosix(pFileOrDirectory);
    })
    .sort();
}
