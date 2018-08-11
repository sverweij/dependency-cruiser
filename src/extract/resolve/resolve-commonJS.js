"use strict";

const path                     = require('path');
const resolve                  = require('resolve');
const enhancedResolve          = require('enhanced-resolve');
const {TsConfigPathsPlugin}    = require('awesome-typescript-loader');
const pathToPosix              = require('../../utl/pathToPosix');
const getExtension             = require('../../utl/getExtension');
const transpileMeta            = require('../transpile/meta');
const determineDependencyTypes = require('./determineDependencyTypes');
const readPackageDeps          = require('./readPackageDeps');
const resolveHelpers           = require('./resolve-helpers');

const CACHE_DURATION = 4000;

let gResolver = null;
let gFollowableExtensions = [];
let gInitialized = false;

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

function initResolver(pResolveOptions) {
    return enhancedResolve.ResolverFactory.createResolver(pResolveOptions);
}

function initFollowableExtensions(pResolveOptions) {
    let lRetval = new Set(pResolveOptions.extensions);

    // we could include things like pictures, movies, html, xml
    // etc in KNOWN_UNFOLLOWABLES as well. Typically in
    // javascript-like sources you don't import non-javascript
    // stuff without mentioning the extension (`import 'styles.scss`
    // is more clear than`import 'styles'` as you'd expect that
    // to resolve to something javascript-like.
    // Defensively added the stylesheetlanguages here explicitly
    // nonetheless - they can contain import statements and the
    // fallback javascript parser will happily parse them, which
    // will result in false positives.
    const KNOWN_UNFOLLOWABLES = [
        ".json",
        ".css", ".sass", ".scss", ".stylus", ".less"
    ];

    KNOWN_UNFOLLOWABLES.forEach(pUnfollowable => {
        lRetval.delete(pUnfollowable);
    });
    return lRetval;
}

function init(pResolveOptions) {
    if (!gInitialized || pResolveOptions.bustTheCache) {
        const lResolveOptions = compileResolveOptions(pResolveOptions);

        gResolver = initResolver(lResolveOptions);
        gFollowableExtensions = initFollowableExtensions(lResolveOptions);
        gInitialized = true;
    }
}

function isFollowable(pResolvedFilename) {
    return gFollowableExtensions.has(getExtension(pResolvedFilename));
}

function addResolutionAttributes(pBaseDir, pModuleName, pFileDir, pResolveOptions) {
    let lRetval = {};

    init(pResolveOptions);

    if (resolve.isCore(pModuleName)){
        lRetval.coreModule = true;
    } else {
        try {
            lRetval.resolved = pathToPosix(
                path.relative(
                    pBaseDir,
                    gResolver.resolveSync(
                        {},
                        // lookupStartPath
                        pathToPosix(pFileDir),
                        // request
                        pModuleName
                    )
                )
            );
            lRetval.followable = isFollowable(lRetval.resolved);
        } catch (e) {
            lRetval.couldNotResolve = true;
        }
    }
    return lRetval;
}

/*
 * resolves both CommonJS and ES6
 */
module.exports = (pModuleName, pBaseDir, pFileDir, pResolveOptions) => {

    let lRetval = Object.assign(
        {
            resolved        : pModuleName,
            coreModule      : false,
            followable      : false,
            couldNotResolve : false,
            dependencyTypes : ["undetermined"]
        },
        addResolutionAttributes(pBaseDir, pModuleName, pFileDir, pResolveOptions)
    );

    return Object.assign(
        lRetval,
        resolveHelpers.addLicenseAttribute(pModuleName, pBaseDir),
        {
            dependencyTypes: determineDependencyTypes(
                lRetval,
                pModuleName,
                readPackageDeps(pFileDir),
                pFileDir,
                pResolveOptions,
                pBaseDir
            )
        }
    );
};
