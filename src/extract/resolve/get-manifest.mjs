import { join, dirname, sep } from "node:path";
import { readFileSync } from "node:fs";
import mergePackages from "./merge-manifests.mjs";

const SINGLE_MANIFEST_CACHE = new Map();
const COMBINED_MANIFEST_CACHE = new Map();

/**
 * return the contents of the package manifest ('package.json' closest to
 * the passed folder (or null if there's no such package.json/ that
 * package.json is invalid).
 *
 * This behavior is consistent with node's lookup mechanism
 *
 * @param {string} pFileDirectory the folder relative to which to find
 *                          the package.json
 * @return {any} the contents of the package.json as a javascript
 *               object or null if the package.json could not be
 *               found or is invalid
 */
function getSingleManifest(pFileDirectory) {
  if (SINGLE_MANIFEST_CACHE.has(pFileDirectory)) {
    return SINGLE_MANIFEST_CACHE.get(pFileDirectory);
  }

  let lReturnValue = null;

  try {
    // find the closest package.json from pFileDirectory
    const lPackageContent = readFileSync(
      join(pFileDirectory, "package.json"),
      "utf8",
    );

    try {
      lReturnValue = JSON.parse(lPackageContent);
    } catch (pError) {
      // left empty on purpose
    }
  } catch (pError) {
    const lNextDirectory = dirname(pFileDirectory);

    if (lNextDirectory !== pFileDirectory) {
      // not yet reached root directory
      lReturnValue = getSingleManifest(lNextDirectory);
    }
  }
  SINGLE_MANIFEST_CACHE.set(pFileDirectory, lReturnValue);
  return lReturnValue;
}

function maybeReadPackage(pFileDirectory) {
  let lReturnValue = {};

  try {
    const lPackageContent = readFileSync(
      join(pFileDirectory, "package.json"),
      "utf8",
    );

    try {
      lReturnValue = JSON.parse(lPackageContent);
    } catch (pError) {
      // left empty on purpose
    }
  } catch (pError) {
    // left empty on purpose
  }
  return lReturnValue;
}

function getIntermediatePaths(pFileDirectory, pBaseDirectory) {
  let lReturnValue = [];
  let lIntermediate = pFileDirectory;

  while (
    lIntermediate !== pBaseDirectory &&
    // safety hatch in case pBaseDirectory is either not a part of
    // pFileDirectory or not something uniquely comparable to a
    // dirname
    lIntermediate !== dirname(lIntermediate)
  ) {
    lReturnValue.push(lIntermediate);
    lIntermediate = dirname(lIntermediate);
  }
  lReturnValue.push(pBaseDirectory);
  return lReturnValue;
}

function getCombinedManifests(pFileDirectory, pBaseDirectory) {
  // The way this is called, this shouldn't happen. If it is, there's
  // something gone terribly awry
  if (
    !pFileDirectory.startsWith(pBaseDirectory) ||
    pBaseDirectory.endsWith(sep)
  ) {
    throw new Error(
      `Unexpected Error: Unusual baseDir passed to package reading function: '${pBaseDirectory}'\n` +
        `Please file a bug: https://github.com/sverweij/dependency-cruiser/issues/new?template=bug-report.md` +
        `&title=Unexpected Error: Unusual baseDir passed to package reading function: '${pBaseDirectory}'`,
    );
  }
  // despite the two parameters this function has, we only use the pFileDirectory
  // parameter as cache key. This is deliberate as the pBaseDirectory will
  // be the same for each call in a typical cruise.
  if (COMBINED_MANIFEST_CACHE.has(pFileDirectory)) {
    return COMBINED_MANIFEST_CACHE.get(pFileDirectory);
  }

  const lMergedPackages = getIntermediatePaths(
    pFileDirectory,
    pBaseDirectory,
  ).reduce(
    (pAll, pCurrent) => mergePackages(pAll, maybeReadPackage(pCurrent)),
    {},
  );

  const lReturnValue =
    Object.keys(lMergedPackages).length > 0 ? lMergedPackages : null;
  COMBINED_MANIFEST_CACHE.set(pFileDirectory, lReturnValue);
  return lReturnValue;
}

/**
 * return
 * - the contents of the package manifest ('package.json') closest to the passed
 *   folder (see read-package-deps above) when pCombinedDependencies === false
 * - the 'combined' contents of all manifests between the passed folder
 *   and the 'root' folder (the folder the cruise was run from) in
 *   all other cases
 * @param  {string}  pFileDirectory              the folder relative to which to find
 *                                         the (closest) package.json
 * @param  {string}  pBaseDirectory              the directory to consider as base (or 'root')
 * @param  {Boolean} pCombinedDependencies whether to stop (false) or continue
 *                                         searching until the 'root'
 * @return {any}                           the contents of a package.json as a javascript
 *                                         object or null if a package.json could not be
 *                                        found or is invalid
 */
export function getManifest(
  pFileDirectory,
  pBaseDirectory,
  pCombinedDependencies = false,
) {
  if (pCombinedDependencies) {
    return getCombinedManifests(pFileDirectory, pBaseDirectory);
  } else {
    return getSingleManifest(pFileDirectory);
  }
}

export function clearCache() {
  SINGLE_MANIFEST_CACHE.clear();
  COMBINED_MANIFEST_CACHE.clear();
}
