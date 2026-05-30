import fs from "node:fs";
import enhancedResolve from "enhanced-resolve";
import { scannableExtensions } from "#extract/transpile/meta.mjs";
import {
  ruleSetHasDeprecationRule,
  ruleSetHasLicenseRule,
} from "#graph-utl/rule-set.mjs";

/**
 * @import { IResolveOptions } from "../../../types/resolve-options.mjs";
 * @import { ICruiseOptions } from "../../../types/options.mjs";
 */

const DEFAULT_CACHE_DURATION = 4000;
/** @type {Partial<IResolveOptions>} */
const DEFAULT_RESOLVE_OPTIONS = {
  symlinks: true,
  // if a webpack config overrides extensions, there's probably
  // good cause. The scannableExtensions are an educated guess
  // anyway.Note: if extract/transpile/index gets an unknown extension
  // it'll fall back to the javascript parser
  extensions: scannableExtensions,
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

function omit(pObject, pProperty) {
  const lObject = structuredClone(pObject);
  // eslint-disable-next-line security/detect-object-injection
  delete lObject[pProperty];
  return lObject;
}

/**
 *
 * @param {Number} pCacheDuration
 * @returns {Partial<IResolveOptions>}
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

function compileResolveOptions(
  pResolveOptions,
  pTSConfig,
  pResolveOptionsFromDCConfig,
) {
  let lResolveOptions = {};

  // There's a performance impact of ~1 ms per resolve even when there
  // are 0 paths in the tsconfig, so not loading it when not necessary
  // will be a win.
  // Also: requiring the plugin only when it's necessary will save some
  // startup time (especially on a cold require cache)
  if (pResolveOptions.tsConfig) {
    lResolveOptions.tsconfig = {
      configFile: pResolveOptions.tsConfig.fileName,

      // baseUrl: pTSConfig?.options?.baseUrl ? undefined : "./",
      // references: pTSConfig?.options?.references ?? []
    };
  }

  return {
    ...DEFAULT_RESOLVE_OPTIONS,
    ...lResolveOptions,
    ...omit(pResolveOptionsFromDCConfig, "cachedInputFileSystem"),
    ...pResolveOptions,
    ...getNonOverridableResolveOptions(
      pResolveOptionsFromDCConfig?.cachedInputFileSystem?.cacheDuration ??
        DEFAULT_CACHE_DURATION,
    ),
  };
}

/**
 * @param {IResolveOptions} pResolveOptions
 * @param {ICruiseOptions} pOptions
 * @param {import("typescript").ParsedTsconfig} pTSConfig
 * @returns
 */
// eslint-disable-next-line complexity
export default function normalizeResolveOptions(
  pResolveOptions,
  pOptions,
  pTSConfig,
) {
  const lRuleSet = pOptions?.ruleSet ?? {};

  return compileResolveOptions(
    {
      // EnhancedResolve's symlinks:
      // - true => symlinks are followed (vv)
      // node's --preserve-symlinks:
      // - true => symlinks are NOT followed (vv)
      // => symlinks = !preserveSymlinks
      symlinks: !pOptions?.preserveSymlinks,
      tsConfig:
        pOptions?.tsConfig?.fileName ??
        pOptions?.ruleSet?.options?.tsConfig?.fileName ??
        null,

      /* squirrel the externalModuleResolutionStrategy and combinedDependencies
         thing into the resolve options
         - they're not for enhanced resolve, but they are for what we consider
         resolve options ...
       */
      combinedDependencies: pOptions?.combinedDependencies ?? false,
      /* Same for the builtInModules override/ add option ...*/
      ...(pOptions?.builtInModules?.override || pOptions?.builtInModules?.add
        ? { builtInModules: pOptions?.builtInModules }
        : {}),
      resolveLicenses: ruleSetHasLicenseRule(lRuleSet),
      resolveDeprecations: ruleSetHasDeprecationRule(lRuleSet),
      ...pResolveOptions,
    },
    pTSConfig || {},
    pOptions?.enhancedResolveOptions ?? {},
  );
}
