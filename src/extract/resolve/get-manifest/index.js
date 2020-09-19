const path = require("path");
const fs = require("fs");
const _memoize = require("lodash/memoize");
const mergePackages = require("./merge-manifests");

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
const getSingleManifest = _memoize((pFileDirectory) => {
  let lReturnValue = null;

  try {
    // find the closest package.json from pFileDirectory
    const lPackageContent = fs.readFileSync(
      path.join(pFileDirectory, "package.json"),
      "utf8"
    );

    try {
      lReturnValue = JSON.parse(lPackageContent);
    } catch (pError) {
      // left empty on purpose
    }
  } catch (pError) {
    const lNextDirectory = path.dirname(pFileDirectory);

    if (lNextDirectory !== pFileDirectory) {
      // not yet reached root directory
      lReturnValue = getSingleManifest(lNextDirectory);
    }
  }
  return lReturnValue;
});

function maybeReadPackage(pFileDirectory) {
  let lReturnValue = {};

  try {
    const lPackageContent = fs.readFileSync(
      path.join(pFileDirectory, "package.json"),
      "utf8"
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
    lIntermediate !== path.dirname(lIntermediate)
  ) {
    lReturnValue.push(lIntermediate);
    lIntermediate = path.dirname(lIntermediate);
  }
  lReturnValue.push(pBaseDirectory);
  return lReturnValue;
}

// despite the two parameters there's no resolver function provided
// to the _.memoize. This is deliberate - the pBaseDirectory will typically
// be the same for each call in a typical cruise, so the lodash'
// default memoize resolver (the first param) will suffice.
const getCombinedManifests = _memoize((pFileDirectory, pBaseDirectory) => {
  // The way this is called, this shouldn't happen. If it is, there's
  // something gone terribly awry
  if (
    !pFileDirectory.startsWith(pBaseDirectory) ||
    pBaseDirectory.endsWith(path.sep)
  ) {
    throw new Error(
      `Unexpected Error: Unusal baseDir passed to package reading function: '${pBaseDirectory}'\n` +
        `Please file a bug: https://github.com/sverweij/dependency-cruiser/issues/new?template=bug-report.md` +
        `&title=Unexpected Error: Unusal baseDir passed to package reading function: '${pBaseDirectory}'`
    );
  }

  const lReturnValue = getIntermediatePaths(
    pFileDirectory,
    pBaseDirectory
  ).reduce(
    (pAll, pCurrent) => mergePackages(pAll, maybeReadPackage(pCurrent)),
    {}
  );

  return Object.keys(lReturnValue).length > 0 ? lReturnValue : null;
});

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
module.exports = function getManifest(
  pFileDirectory,
  pBaseDirectory,
  pCombinedDependencies = false
) {
  if (pCombinedDependencies) {
    return getCombinedManifests(pFileDirectory, pBaseDirectory);
  } else {
    return getSingleManifest(pFileDirectory);
  }
};
module.exports.clearCache = () => {
  getCombinedManifests.cache.clear();
  getSingleManifest.cache.clear();
};
