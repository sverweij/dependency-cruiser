const { join } = require("node:path");
const satisfies = require("semver/functions/satisfies");
const coerce = require("semver/functions/coerce");
const extractRootModuleName = require("./extract-root-module-name.cjs");

/**
 * @throws {Error}
 * @param pModuleName the name of the module to get the version for
 * @return the version of the module identified by pModuleName
 */
function getVersion(pModuleName) {
  // @ts-expect-error TS2345 extractRootModuleName can return either a string or
  // undefined. If undefined this function will throw. Which is _fine_, even
  // _expected_ in the context it's currently used
  // eslint-disable-next-line import/no-dynamic-require, n/global-require, security/detect-non-literal-require
  return require(join(extractRootModuleName(pModuleName), "package.json"))
    .version;
}

/**
 * returns the (resolved) module identified by pModuleName:
 * - if it is available, and
 * - it satisfies the semantic version range specified by pSemVer
 *
 * returns false in all other cases
 *
 * @param {string} pModuleName      the name of the module to resolve
 * @param {string} [pSemanticVersion] (optional) a semantic version (range)
 * @return {NodeModule | false }the (resolved) module identified by pModuleName or false
 */
function tryRequire(pModuleName, pSemanticVersion) {
  try {
    if (pSemanticVersion) {
      const lVersion = getVersion(pModuleName);
      const lCoerced = coerce(lVersion);
      if (
        lVersion &&
        lCoerced &&
        !satisfies(lCoerced.version, pSemanticVersion)
      ) {
        return false;
      }
    }
    // eslint-disable-next-line import/no-dynamic-require, n/global-require, security/detect-non-literal-require
    return require(pModuleName);
  } catch (pError) {
    return false;
  }
}

module.exports = tryRequire;
