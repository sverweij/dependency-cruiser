const enhancedResolve       = require('enhanced-resolve');
const pathToPosix           = require('../../utl/pathToPosix');
const compileResolveOptions = require('./compileResolveOptions');

let gResolver = null;
let gInitialized = false;

function init(pResolveOptions) {
    if (!gInitialized || pResolveOptions.bustTheCache) {
        gResolver = enhancedResolve.ResolverFactory.createResolver(
            compileResolveOptions(pResolveOptions)
        );
        gInitialized = true;
    }
}

/**
 * Resolves the given module to a path to a file on disk.
 *
 * @param {string} pModuleName The module name to resolve (e.g. 'slodash', './myModule')
 * @param {string} pFileDir The directory from which to resolve the module
 * @param {any} pResolveOptions Options to pass to enhanced resolve
 * @returns {string} path to the resolved file on disk
 */
function resolve (pModuleName, pFileDir, pResolveOptions) {

    init(pResolveOptions);

    return gResolver.resolveSync(
        {},
        // lookupStartPath
        pathToPosix(pFileDir),
        // request
        pModuleName
    );
}

module.exports = resolve;
