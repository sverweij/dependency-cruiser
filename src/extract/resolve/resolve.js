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

function resolve(pModuleName, pFileDir, pResolveOptions){

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
