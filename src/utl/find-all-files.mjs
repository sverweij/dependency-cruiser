import { readdirSync, statSync, readFileSync } from "node:fs";
import { join } from "node:path";
import ignore from "ignore";
import pathToPosix from "./path-to-posix.mjs";

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
  { baseDir, ignoreFilterFn, excludeFilterFn, includeOnlyFilterFn },
) {
  const lFilesInCurrentDirectory = readdirSync(join(baseDir, pDirectoryName))
    .map((pFileName) => join(pDirectoryName, pFileName))
    .filter(ignoreFilterFn)
    .filter(excludeFilterFn)
    .filter(includeOnlyFilterFn);

  const lFiles = [];
  for (const lFile of lFilesInCurrentDirectory) {
    if (fileIsDirectory(lFile, baseDir)) {
      lFiles.push(
        ...walk(lFile, {
          baseDir,
          ignoreFilterFn,
          excludeFilterFn,
          includeOnlyFilterFn,
        }),
      );
    } else {
      lFiles.push(pathToPosix(lFile));
    }
  }

  return lFiles;
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

function identityFilter(_pString, _pIndex, _pArray) {
  return true;
}

/**
 * @param {string} pDirectoryName
 * @param {{baseDir: string; ignoreFileContents?: string; additionalIgnorePatterns?: string[]; excludeFilterFn?: FilterFunctionType; includeOnlyFilterFn?: FilterFunctionType}} pOptions
 * @returns {string[]}
 */
export default function findAllFiles(
  pDirectoryName,
  {
    baseDir,
    ignoreFileContents,
    additionalIgnorePatterns,
    excludeFilterFn,
    includeOnlyFilterFn,
  },
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
}
