const enhancedResolve = require("enhanced-resolve");
const pathToPosix = require("../utl/path-to-posix");
const stripQueryParameters = require("../utl/strip-query-parameters");

let gResolvers = {};
let gInitialized = {};

function init(pResolveOptions, pCachingContext) {
  if (!gInitialized[pCachingContext] || pResolveOptions.bustTheCache) {
    // assuming the cached file system here
    pResolveOptions.fileSystem.purge();
    gResolvers[
      pCachingContext
    ] = enhancedResolve.ResolverFactory.createResolver({
      ...pResolveOptions,
      // we're doing that ourselves for now. We can't set this in
      // 'normalize' because we actively use resolveOptions.symlinks
      // with our own symlink resolution thing, so we need to override
      // it here locally so even when it is passed as true we skip
      // ehr's capabilities in this and still do it ourselves.
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
    gResolvers[pCachingContext].resolveSync(
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
  gResolvers = {};
};
