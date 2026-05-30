import { resolve as resolvePath } from "node:path";
import enhancedResolve from "enhanced-resolve";
import { stripQueryParameters } from "../helpers.mjs";

/** @import {IResolveOptions} from "../../../types/resolve-options.mjs" */

/** @type {Map<string, enhancedResolve.Resolver>} */
let gResolvers = new Map();
/** @type {Set<string>} */
let gInitialized = new Set();

/**
 * Initializes a resolver for the given caching context if not already done
 *
 * @param {IResolveOptions} pEHResolveOptions Options to pass to enhanced resolve
 * @param {string} pCachingContext - caching
 *
 * @returns {void}
 */
function init(pEHResolveOptions, pCachingContext) {
  if (!gInitialized.has(pCachingContext) || pEHResolveOptions.bustTheCache) {
    // assuming the cached file system here
    pEHResolveOptions.fileSystem.purge();
    gResolvers.set(
      pCachingContext,
      enhancedResolve.ResolverFactory.createResolver(pEHResolveOptions),
    );
    gInitialized.add(pCachingContext);
  }
}

/**
 * Resolves the given module to a path to a file on disk.
 *
 * @param {string} pModuleName The module name to resolve (e.g. 'slodash', './myModule')
 * @param {string} pFileDirectory The directory from which to resolve the module
 * @param {IResolveOptions} pResolveOptions Options to pass to enhanced resolve
 * @param {string} pCachingContext - caching
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
      // lookupStartPath - must be absolute so enhanced-resolve classifies
      // it correctly on Windows (relative paths with backslashes would be
      // treated as PathType.Normal and POSIX-normalised, breaking ".." resolution)
      resolvePath(pFileDirectory),
      // request
      pModuleName,
    ),
  );
}

export function clearCache() {
  gInitialized.clear();
  gResolvers.clear();
}
