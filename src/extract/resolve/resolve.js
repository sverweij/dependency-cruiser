const enhancedResolve = require("enhanced-resolve");
const pathToPosix = require("../../utl/path-to-posix");
const stripQueryParameters = require("../utl/strip-query-parameters");

let gResolver = null;
let gInitialized = {};

function init(pResolveOptions, pCachingContext) {
  if (!gInitialized[pCachingContext] || pResolveOptions.bustTheCache) {
    // assuming the cached file system here
    pResolveOptions.fileSystem.purge();
    gResolver = enhancedResolve.ResolverFactory.createResolver({
      ...pResolveOptions,
      // we're doing that ourselves for now
      symlinks: false,
    });
    /* eslint security/detect-object-injection:0 */
    gInitialized[pCachingContext] = true;
  }
}

/**
 * Resolves the given module to a path to a file on disk.
 *
 * @param {string} pModuleName The module name to resolve (e.g. 'slodash', './myModule')
 * @param {string} pFileDirectory The directory from which to resolve the module
 * @param {any} pResolveOptions Options to pass to enhanced resolve
 * @param {any} pCachingContext - caching
 *
 * @returns {string} path to the resolved file on disk
 */
function resolve(
  pModuleName,
  pFileDirectory,
  pResolveOptions,
  pCachingContext = "cruise"
) {
  init(pResolveOptions, pCachingContext);

  return stripQueryParameters(
    gResolver.resolveSync(
      {},
      // lookupStartPath
      pathToPosix(pFileDirectory),
      // request
      pModuleName
    )
  );
}

module.exports = resolve;
module.exports.clearCache = () => {
  gInitialized = {};
};
