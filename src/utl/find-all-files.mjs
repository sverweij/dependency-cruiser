import { readdirSync, statSync, readFileSync } from "node:fs";
import { join, relative } from "node:path";
import ignore from "ignore";
import pathToPosix from "./path-to-posix.mjs";

/**
 * @typedef {(pString:string, pIndex: number, pArray: string[]) => boolean} FilterFunctionType
 */

/**
 * @typedef {{directoryName: string; ignoreMatcher: import("ignore").Ignore}} IgnoreRuleType
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
 * @param {string} pFileName
 * @returns {string}
 */
function readIgnoreFile(pFileName) {
  try {
    return readFileSync(pFileName, "utf8");
  } catch {
    return "";
  }
}

/**
 * @param {string} pDirectoryName
 * @param {string} pBaseDirectory
 * @returns {string}
 */
function normalizeDirectoryName(pDirectoryName, pBaseDirectory) {
  return pathToPosix(
    relative(pBaseDirectory, join(pBaseDirectory, pDirectoryName)),
  );
}

/**
 * @param {string} pDirectoryName
 * @param {string} pIgnoreFileContents
 * @param {string[]=} pAdditionalIgnorePatterns
 * @returns {IgnoreRuleType}
 */
function createIgnoreRule(
  pDirectoryName,
  pIgnoreFileContents,
  pAdditionalIgnorePatterns = [],
) {
  return {
    directoryName: pDirectoryName,
    ignoreMatcher: ignore()
      .add(pIgnoreFileContents)
      .add(pAdditionalIgnorePatterns),
  };
}

/**
 * @param {string} pDirectoryName
 * @param {string} pBaseDirectory
 * @param {{ignoreFileContents?: string}} pOptions
 * @returns {IgnoreRuleType}
 */
function createIgnoreRuleForDirectory(
  pDirectoryName,
  pBaseDirectory,
  pOptions,
) {
  const lIgnoreFileContents =
    pOptions.ignoreFileContents === undefined
      ? readIgnoreFile(join(pBaseDirectory, pDirectoryName, ".gitignore"))
      : pOptions.ignoreFileContents;

  return createIgnoreRule(pDirectoryName, lIgnoreFileContents);
}

/**
 * @param {string[]} pAncestorDirectoryNames
 * @param {string} pBaseDirectory
 * @returns {IgnoreRuleType[]}
 */
function createIgnoreRulesFromDirectoryNames(
  pAncestorDirectoryNames,
  pBaseDirectory,
) {
  return pAncestorDirectoryNames.map((pAncestorDirectoryName) =>
    createIgnoreRuleForDirectory(pAncestorDirectoryName, pBaseDirectory, {}),
  );
}

/**
 * @param {string} pDirectoryName
 * @param {string} pBaseDirectory
 * @returns {IgnoreRuleType[]}
 */
function createIgnoreRulesBeforeDirectory(pDirectoryName, pBaseDirectory) {
  const lNormalizedDirectoryName = normalizeDirectoryName(
    pDirectoryName,
    pBaseDirectory,
  );

  if (lNormalizedDirectoryName === "") {
    return [];
  }

  const lDirectorySegments = lNormalizedDirectoryName.split("/");
  const lAncestorDirectoryNames = [""];
  let lCurrentDirectoryName = "";

  for (const lDirectorySegment of lDirectorySegments.slice(0, -1)) {
    lCurrentDirectoryName = lCurrentDirectoryName
      ? join(lCurrentDirectoryName, lDirectorySegment)
      : lDirectorySegment;
    lAncestorDirectoryNames.push(pathToPosix(lCurrentDirectoryName));
  }

  return createIgnoreRulesFromDirectoryNames(
    lAncestorDirectoryNames,
    pBaseDirectory,
  );
}

/**
 * @param {string} pFilePath
 * @param {IgnoreRuleType[]} pIgnoreRules
 * @returns {boolean}
 */
function fileShouldBeKept(pFilePath, pIgnoreRules) {
  let lFileIsIgnored = false;

  for (const lIgnoreRule of pIgnoreRules) {
    const lDirectoryName = lIgnoreRule.directoryName;
    const lIgnoreMatcher = lIgnoreRule.ignoreMatcher;
    let lRelativePath = null;

    if (lDirectoryName === "") {
      lRelativePath = pFilePath;
    } else if (pFilePath.startsWith(`${lDirectoryName}/`)) {
      lRelativePath = pFilePath.slice(lDirectoryName.length + 1);
    }

    if (lRelativePath !== null) {
      const { ignored: lIgnored, unignored: lUnignored } =
        lIgnoreMatcher.test(lRelativePath);

      if (lIgnored) {
        lFileIsIgnored = true;
      }
      if (lUnignored) {
        lFileIsIgnored = false;
      }
    }
  }

  return !lFileIsIgnored;
}

/**
 * @type FilterFunctionType
 */

function identityFilter(_pString, _pIndex, _pArray) {
  return true;
}

/**
 * @param {string} pDirectoryName
 * @param {{baseDir: string; ignoreRules: IgnoreRuleType[]; startDirectoryName: string; startDirectoryIgnoreFileContents?: string; excludeFilterFn: FilterFunctionType; includeOnlyFilterFn: FilterFunctionType}}
 *   pOptions
 * @returns {string[]}
 */
function walk(
  pDirectoryName,
  {
    baseDir,
    ignoreRules,
    startDirectoryName,
    startDirectoryIgnoreFileContents,
    excludeFilterFn,
    includeOnlyFilterFn,
  },
) {
  const lCurrentDirectoryName = normalizeDirectoryName(pDirectoryName, baseDir);
  const lCurrentIgnoreRules = ignoreRules.concat(
    createIgnoreRuleForDirectory(lCurrentDirectoryName, baseDir, {
      ...(lCurrentDirectoryName === startDirectoryName &&
      startDirectoryIgnoreFileContents !== undefined
        ? { ignoreFileContents: startDirectoryIgnoreFileContents }
        : {}),
    }),
  );

  const lFilesInCurrentDirectory = readdirSync(join(baseDir, pDirectoryName))
    .map((pFileName) => join(pDirectoryName, pFileName))
    .filter((pFilePath) => fileShouldBeKept(pFilePath, lCurrentIgnoreRules))
    .filter(excludeFilterFn)
    .filter(includeOnlyFilterFn);

  const lFiles = [];
  for (const lFile of lFilesInCurrentDirectory) {
    if (fileIsDirectory(lFile, baseDir)) {
      lFiles.push(
        ...walk(lFile, {
          baseDir,
          ignoreRules: lCurrentIgnoreRules,
          startDirectoryName,
          startDirectoryIgnoreFileContents,
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

/**
 * @param {string} pDirectoryName
 * @param {{baseDir: string; ignoreFileContents?: string; additionalIgnorePatterns?: string[]; excludeFilterFn?: FilterFunctionType; includeOnlyFilterFn?: FilterFunctionType}}
 *   pOptions
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
  const lAdditionalIgnorePatterns = additionalIgnorePatterns ?? [".git"];
  const lStartDirectoryName = normalizeDirectoryName(pDirectoryName, baseDir);
  const lIgnoreRules = [
    createIgnoreRule("", "", lAdditionalIgnorePatterns),
    ...createIgnoreRulesBeforeDirectory(pDirectoryName, baseDir),
  ];

  return walk(pDirectoryName, {
    baseDir,
    ignoreRules: lIgnoreRules,
    startDirectoryName: lStartDirectoryName,
    startDirectoryIgnoreFileContents: ignoreFileContents,
    excludeFilterFn: excludeFilterFn ?? identityFilter,
    includeOnlyFilterFn: includeOnlyFilterFn ?? identityFilter,
  });
}
