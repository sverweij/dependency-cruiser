import enhancedResolve from "enhanced-resolve";
import { stripQueryParameters } from "../helpers.mjs";
import pathToPosix from "#utl/path-to-posix.mjs";

let gResolvers = new Map();
let gInitialized = new Map();

function init(pEHResolveOptions, pCachingContext) {
  if (!gInitialized.get(pCachingContext) || pEHResolveOptions.bustTheCache) {
    // assuming the cached file system here
    pEHResolveOptions.fileSystem.purge();
    gResolvers.set(
      pCachingContext,
      enhancedResolve.ResolverFactory.createResolver(pEHResolveOptions),
    );
    /* eslint security/detect-object-injection:0 */
    gInitialized.set(pCachingContext, true);
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
export function resolve(
  pModuleName,
  pFileDirectory,
  pResolveOptions,
  pCachingContext = "cruise",
) {
  init(pResolveOptions, pCachingContext);

  return stripQueryParameters(
    gResolvers.get(pCachingContext).resolveSync(
      {},
      // lookupStartPath
      pathToPosix(pFileDirectory),
      // request
      pModuleName,
    ),
  );
}

export function clearCache() {
  gInitialized.clear();
  gResolvers.clear();
}
