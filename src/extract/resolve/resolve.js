const enhancedResolve       = require('enhanced-resolve');
const pathToPosix           = require('../../utl/pathToPosix');
const compileResolveOptions = require('./compileResolveOptions');

let gResolver = null;
let gInitialized = {};

function init(pResolveOptions, pCachingContext) {
    if (!gInitialized[pCachingContext] || pResolveOptions.bustTheCache) {
        gResolver = enhancedResolve.ResolverFactory.createResolver(
            compileResolveOptions(pResolveOptions)
        );
        /* eslint security/detect-object-injection:0 */
        gInitialized[pCachingContext] = true;
    }
}

/**
 * Resolves the given module to a path to a file on disk.
 *
 * @param {string} pModuleName The module name to resolve (e.g. 'slodash', './myModule')
 * @param {string} pFileDir The directory from which to resolve the module
 * @param {any} pResolveOptions Options to pass to enhanced resolve
 * @param {any} pCachingContext - caching
 *
 * @returns {string} path to the resolved file on disk
 */
function resolve (pModuleName, pFileDir, pResolveOptions, pCachingContext = 'cruise') {

    init(pResolveOptions, pCachingContext);

    return gResolver.resolveSync(
        {},
        // lookupStartPath
        pathToPosix(pFileDir),
        // request
        pModuleName
    );
}

module.exports = resolve;
