const enhancedResolve          = require('enhanced-resolve');
const {TsConfigPathsPlugin}    = require('awesome-typescript-loader');
const transpileMeta            = require('../transpile/meta');

const CACHE_DURATION = 4000;

function compileResolveOptions(pResolveOptions){
    let DEFAULT_RESOLVE_OPTIONS = {
        // we can later on make symlinks listen to the preserveSymlinks option
        // and chuck some code to manually do this in index.js
        symlinks: false,
        // if a webpack config overrides extensions, there's probably
        // good cause. The scannableExtensions are an educated guess
        // anyway, that works well in most circumstances.
        // Note that if extract/transpile/index gets an unknown extension
        // passed, it'll fall back to the javascript parser
        extensions: transpileMeta.scannableExtensions
    };

    const NON_OVERRIDABLE_RESOLVE_OPTIONS = {
        // This should cover most of the bases of dependency-cruiser's
        // uses. Not overridable for now because for other
        // file systems it's not sure we can use sync system calls
        // Also: passing a non-cached filesystem makes performance
        // worse.
        fileSystem: new enhancedResolve.CachedInputFileSystem(
            new enhancedResolve.NodeJsInputFileSystem(),
            CACHE_DURATION
        ),
        // our code depends on sync behavior, so having this
        // overriden is not an option
        useSyncFileSystemCalls: true
    };

    let lResolveOptions = {};

    if (pResolveOptions.tsConfig) {
        lResolveOptions.plugins = [
            new TsConfigPathsPlugin({configFileName: pResolveOptions.tsConfig})
        ];
    }

    return Object.assign(
        DEFAULT_RESOLVE_OPTIONS,
        lResolveOptions,
        pResolveOptions,
        NON_OVERRIDABLE_RESOLVE_OPTIONS
    );
}

module.exports = compileResolveOptions;
