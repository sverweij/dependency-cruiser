const fs = require("fs");
const get = require("lodash/get");
const has = require("lodash/has");
const _omit = require("lodash/omit");
const enhancedResolve = require("enhanced-resolve");
const transpileMeta = require("../../extract/transpile/meta");
const {
  ruleSetHasLicenseRule,
  ruleSetHasDeprecationRule,
} = require("../../graph-utl/rule-set");

const DEFAULT_CACHE_DURATION = 4000;
/** @type {Partial<import("../../..").IResolveOptions>} */
const DEFAULT_RESOLVE_OPTIONS = {
  // for later: check semantics of enhanced-resolve symlinks and
  // node's preserveSymlinks. They seem to be
  // symlink === !preserveSymlinks - but using it that way
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
  // this overrides the default exports fields enhanced-resolve uses
  // (being ["exports"]) to keep backwards compatibility between enhanced-resolve
  // 4 and 5 (4 didn't heed them at all and the empty array has the same
  // effect).
  // Also see https://github.com/sverweij/dependency-cruiser/issues/338
  exportsFields: [],
};

/**
 *
 * @param {Number} pCacheDuration
 * @returns {Partial<import("../../..").IResolveOptions>}
 */
function getNonOverridableResolveOptions(pCacheDuration) {
  return {
    // This should cover most of the bases of dependency-cruiser's
    // uses. Not overridable for now because for other
    // file systems it's not sure we can use sync system calls
    // Also: passing a non-cached filesystem makes performance
    // worse.
    fileSystem: new enhancedResolve.CachedInputFileSystem(fs, pCacheDuration),
    // our code depends on sync behavior, so having this
    // overridden is not an option
    useSyncFileSystemCalls: true,
  };
}

function pushPlugin(pPlugins, pPluginToPush) {
  return (pPlugins || []).concat(pPluginToPush);
}

function isTsConfigPathsEligible(pTSConfig) {
  return has(pTSConfig, "options.baseUrl");
}

function compileResolveOptions(
  pResolveOptions,
  pTSConfig,
  pResolveOptionsFromDCConfig
) {
  let lResolveOptions = {};

  // TsConfigPathsPlugin requires a baseUrl to be present in the
  // tsconfig, otherwise it prints scary messages that it didn't
  // and read the tsConfig (potentially making users think it's
  // dependency-cruiser disregarding the tsconfig). Hence:
  // only load TsConfigPathsPlugin when an options.baseUrl
  // exists
  // Also: there's a performance impact of ~1 ms per resolve even when there
  // are 0 paths in the tsconfig, so not loading it when not necessary
  // will be a win.
  // Also: requiring the plugin only when it's necessary will save some
  // startup time (especially on a cold require cache)
  if (pResolveOptions.tsConfig && isTsConfigPathsEligible(pTSConfig)) {
    // eslint-disable-next-line node/global-require
    const TsConfigPathsPlugin = require("tsconfig-paths-webpack-plugin");
    lResolveOptions.plugins = pushPlugin(
      lResolveOptions.plugins,
      // @ts-expect-error TS2351 "TsConfPathsPlugin is not constructable" - is unjustified
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

  return {
    ...DEFAULT_RESOLVE_OPTIONS,
    ...lResolveOptions,
    ..._omit(pResolveOptionsFromDCConfig, "cachedInputFileSystem"),
    ...pResolveOptions,
    ...getNonOverridableResolveOptions(
      get(
        pResolveOptionsFromDCConfig,
        "cachedInputFileSystem.cacheDuration",
        DEFAULT_CACHE_DURATION
      )
    ),
  };
}

/**
 * @param {import("../../..").IResolveOptions} pResolveOptions
 * @param {import("../../..").ICruiseOptions} pOptions
 * @param {import("typescript").ParsedTsconfig} pTSConfig
 * @returns
 */
module.exports = function normalizeResolveOptions(
  pResolveOptions,
  pOptions,
  pTSConfig
) {
  const lRuleSet = get(pOptions, "ruleSet", {});
  return compileResolveOptions(
    {
      /*
        for later: check semantics of enhanced-resolve symlinks and
        node's preserveSymlinks. They seem to be
        symlink === !preserveSymlinks - but using it that way
        breaks backwards compatibility
      */
      symlinks: get(pOptions, "preserveSymlinks", null),
      tsConfig: get(pOptions, "ruleSet.options.tsConfig.fileName", null),

      /* squirrel the externalModuleResolutionStrategy and combinedDependencies
         thing into the resolve options
         - they're not for enhanced resolve, but they are for what we consider
         resolve options ...
       */
      combinedDependencies: get(pOptions, "combinedDependencies", false),
      resolveLicenses: ruleSetHasLicenseRule(lRuleSet),
      resolveDeprecations: ruleSetHasDeprecationRule(lRuleSet),
      ...(pResolveOptions || {}),
    },
    pTSConfig || {},
    get(pOptions, "enhancedResolveOptions", {})
  );
};
