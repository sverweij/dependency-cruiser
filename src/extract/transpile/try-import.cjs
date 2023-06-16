const { join } = require("node:path");
const tryRequire = require("semver-try-require");

/**
 * returns the (resolved) module identified by pModuleName:
 * - if it is available, and
 * - it satisfies the semantic version range specified by pSemVer
 *
 * returns false in all other cases
 *
 * resolves module in current working directory first, then fallback
 * to node's default (for npm i -g)
 *
 * @param pModuleName the name of the module to resolve
 * @param pSemanticVersion     (optional) a semantic version (range)
 * @return            the (resolved) module identified by pModuleName
 *                    or false
 */
function tryImport(pModuleName, pSupportedVersionRange) {
  return (
    tryRequire(pModuleName, pSupportedVersionRange, {
      path: join(process.cwd(), "dummy.js"),
    }) || tryRequire(pModuleName, pSupportedVersionRange)
  );
}
module.exports = tryImport;
