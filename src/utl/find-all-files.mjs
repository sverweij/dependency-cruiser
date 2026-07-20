import { readdirSync, statSync, readFileSync } from "node:fs";
import { join, relative } from "node:path";
import ignore from "ignore";
import pathToPosix from "./path-to-posix.mjs";

/**
 * @typedef {(pString:string, pIndex: number, pArray: string[]) => boolean} FilterFunctionType
 */

/**
 * @typedef {{directoryName: string; filterFn: FilterFunctionType}} IgnoreRuleType
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
  } catch (pError) {
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
 * @param {string[]} pAdditionalIgnorePatterns
 * @returns {IgnoreRuleType}
 */
function createIgnoreRule(
  pDirectoryName,
  pIgnoreFileContents,
  pAdditionalIgnorePatterns,
) {
  return {
    directoryName: pDirectoryName,
    filterFn: ignore()
      .add(pIgnoreFileContents)
      .add(pAdditionalIgnorePatterns)
      .createFilter(),
  };
}

/**
 * @param {string} pDirectoryName
 * @param {string} pBaseDirectory
 * @param {{ignoreFileContents?: string; additionalIgnorePatterns: string[]}}
 *   pOptions
 * @returns {IgnoreRuleType}
 */
function createIgnoreRuleForDirectory(
  pDirectoryName,
  pBaseDirectory,
  pOptions,
) {
  const lIgnoreFileContents =
    typeof pOptions.ignoreFileContents === "undefined"
      ? readIgnoreFile(join(pBaseDirectory, pDirectoryName, ".gitignore"))
      : pOptions.ignoreFileContents;

  return createIgnoreRule(
    pDirectoryName,
    lIgnoreFileContents,
    pOptions.additionalIgnorePatterns,
  );
}

/**
 * @param {string[]} pAncestorDirectoryNames
 * @param {string} pBaseDirectory
 * @param {{ignoreFileContents?: string; additionalIgnorePatterns: string[]}} pOptions
 * @returns {IgnoreRuleType[]}
 */
function createIgnoreRulesFromDirectoryNames(
  pAncestorDirectoryNames,
  pBaseDirectory,
  pOptions,
) {
  const lIgnoreRules = [];
  let lIsRootDirectory = true;

  for (const lAncestorDirectoryName of pAncestorDirectoryNames) {
    const lIgnoreRuleOptions = {
      additionalIgnorePatterns: pOptions.additionalIgnorePatterns,
    };

    if (
      lIsRootDirectory &&
      typeof pOptions.ignoreFileContents !== "undefined"
    ) {
      lIgnoreRuleOptions.ignoreFileContents = pOptions.ignoreFileContents;
    }

    lIgnoreRules.push(
      createIgnoreRuleForDirectory(
        lAncestorDirectoryName,
        pBaseDirectory,
        lIgnoreRuleOptions,
      ),
    );
    lIsRootDirectory = false;
  }

  return lIgnoreRules;
}

/**
 * @param {string} pDirectoryName
 * @param {string} pBaseDirectory
 * @param {{ignoreFileContents?: string; additionalIgnorePatterns: string[]}}
 *   pOptions
 * @returns {IgnoreRuleType[]}
 */
function createIgnoreRulesBeforeDirectory(
  pDirectoryName,
  pBaseDirectory,
  pOptions,
) {
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
    pOptions,
  );
}

/**
 * @param {string} pFilePath
 * @param {IgnoreRuleType[]} pIgnoreRules
 * @returns {boolean}
 */
function fileShouldBeKept(pFilePath, pIgnoreRules) {
  return pIgnoreRules.every(({ directoryName, filterFn }) => {
    let lRelativePath = null;

    if (directoryName === "") {
      lRelativePath = pFilePath;
    } else if (pFilePath === directoryName) {
      lRelativePath = "";
    } else if (pFilePath.startsWith(`${directoryName}/`)) {
      lRelativePath = pFilePath.slice(directoryName.length + 1);
    }

    return lRelativePath === null ? true : filterFn(lRelativePath);
  });
}

/**
 * @type FilterFunctionType
 */

function identityFilter(_pString, _pIndex, _pArray) {
  return true;
}

/**
 * @param {string} pDirectoryName
 * @param {{baseDir: string; ignoreRules: IgnoreRuleType[]; rootIgnoreFileContents?: string; additionalIgnorePatterns: string[]; excludeFilterFn: FilterFunctionType; includeOnlyFilterFn: FilterFunctionType}}
 *   pOptions
 * @returns {string[]}
 */
function walk(
  pDirectoryName,
  {
    baseDir,
    ignoreRules,
    rootIgnoreFileContents,
    additionalIgnorePatterns,
    excludeFilterFn,
    includeOnlyFilterFn,
  },
) {
  const lCurrentDirectoryName = normalizeDirectoryName(pDirectoryName, baseDir);
  const lCurrentIgnoreRules = ignoreRules.concat(
    createIgnoreRuleForDirectory(lCurrentDirectoryName, baseDir, {
      additionalIgnorePatterns,
      ...(lCurrentDirectoryName === "" &&
      typeof rootIgnoreFileContents !== "undefined"
        ? { ignoreFileContents: rootIgnoreFileContents }
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
          rootIgnoreFileContents,
          additionalIgnorePatterns,
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
  const lIgnoreRules = createIgnoreRulesBeforeDirectory(
    pDirectoryName,
    baseDir,
    {
      additionalIgnorePatterns: lAdditionalIgnorePatterns,
      ignoreFileContents:
        ignoreFileContents ?? readIgnoreFile(join(baseDir, ".gitignore")),
    },
  );

  return walk(pDirectoryName, {
    baseDir,
    ignoreRules: lIgnoreRules,
    rootIgnoreFileContents: ignoreFileContents,
    additionalIgnorePatterns: lAdditionalIgnorePatterns,
    excludeFilterFn: excludeFilterFn ?? identityFilter,
    includeOnlyFilterFn: includeOnlyFilterFn ?? identityFilter,
  });
}
