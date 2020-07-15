const fs = require("fs");
const _get = require("lodash/get");
const _has = require("lodash/has");
const enhancedResolve = require("enhanced-resolve");
const PnpWebpackPlugin = require("pnp-webpack-plugin");
const TsConfigPathsPlugin = require("tsconfig-paths-webpack-plugin");
const transpileMeta = require("../../extract/transpile/meta");

const CACHE_DURATION = 1000;
const DEFAULT_RESOLVE_OPTIONS = {
  // for later: check semantics of enhanced-resolve symlinks and
  // node's preserveSymlinks. They seem to be
  // symlink === !preserveSynlinks - but using it that way
  // breaks backwards compatibility
  //
  // Someday we'll rely on this and remove the code that manually
  // does this in extract/resolve/index.js
  symlinks: false,
  // if a webpack config overrides extensions, there's probably
  // good cause. The scannableExtensions are an educated guess
  // anyway, that works well in most circumstances.
  // Note that if extract/transpile/index gets an unknown extension
  // passed, it'll fall back to the javascript parser
  extensions: transpileMeta.scannableExtensions,
  // for typescript projects that import stuff that's only in
  // node_modules/@types we need:
  // - the inclusion of .d.ts to the extensions (see above)
  // - an explicit inclusion of node_modules/@types to the spots
  //   to look for modules (in addition to "node_modules" which
  //   is the default for enhanced-resolve)
  modules: ["node_modules", "node_modules/@types"],
};

const NON_OVERRIDABLE_RESOLVE_OPTIONS = {
  // This should cover most of the bases of dependency-cruiser's
  // uses. Not overridable for now because for other
  // file systems it's not sure we can use sync system calls
  // Also: passing a non-cached filesystem makes performance
  // worse.
  fileSystem: new enhancedResolve.CachedInputFileSystem(fs, CACHE_DURATION),
  // our code depends on sync behavior, so having this
  // overriden is not an option
  useSyncFileSystemCalls: true,
};

function pushPlugin(pPlugins, pPluginToPush) {
  return (pPlugins || []).concat(pPluginToPush);
}

function compileResolveOptions(pResolveOptions, pTSConfig) {
  let lResolveOptions = {};

  // TsConfigPathsPlugin requires a baseUrl to be present in the
  // tsconfig, otherwise it prints scary messages that it didn't
  // and read the tsConfig (potentially making users think it's
  // dependency-cruiser disregarding the tsconfig). Hence:
  // only load TsConfigPathsPlugin when an options.baseUrl
  // exists
  if (pResolveOptions.tsConfig && _has(pTSConfig, "options.baseUrl")) {
    lResolveOptions.plugins = pushPlugin(
      lResolveOptions.plugins,
      new TsConfigPathsPlugin({
        configFile: pResolveOptions.tsConfig,
        // TsConfigPathsPlugin doesn't (can't) read enhanced-resolve's
        // list of extensions, and the default it uses for extensions
        // so we do it ourselves - either with the extensions passed
        // or with the supported ones.
        extensions:
          pResolveOptions.extensions || DEFAULT_RESOLVE_OPTIONS.extensions,
      })
    );
  }

  if (pResolveOptions.externalModuleResolutionStrategy === "yarn-pnp") {
    lResolveOptions.plugins = pushPlugin(
      lResolveOptions.plugins,
      PnpWebpackPlugin
    );
  }

  return {
    ...DEFAULT_RESOLVE_OPTIONS,
    ...lResolveOptions,
    ...pResolveOptions,
    ...NON_OVERRIDABLE_RESOLVE_OPTIONS,
  };
}

module.exports = (pResolveOptions, pOptions, pTSConfig) =>
  compileResolveOptions(
    {
      /*
            for later: check semantics of enhanced-resolve symlinks and
            node's preserveSymlinks. They seem to be
            symlink === !preserveSymlinks - but using it that way
            breaks backwards compatibility
        */
      symlinks: pOptions.preserveSymlinks,
      tsConfig: _get(pOptions, "ruleSet.options.tsConfig.fileName", null),

      /* squirel the externalModuleResolutionStrategy and combinedDependencies
            thing into the resolve options
            - they're not for enhanced resolve, but they are for what we consider
            resolve options ...
        */
      externalModuleResolutionStrategy:
        pOptions.externalModuleResolutionStrategy,
      combinedDependencies: pOptions.combinedDependencies,
      ...(pResolveOptions || {}),
    },
    pTSConfig || {}
  );
