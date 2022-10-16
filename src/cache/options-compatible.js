const { objectsAreEqual } = require("./utl");

/*
# command line options
## No influence on cache
  -i, --info                  
  -V, --version               
  -h, --help         
  -T, --output-type <type>    unless counting implicit shizzle like dependendents, metrics calculation
  -f, --output-to <file>      
  -p, --progress [type]       
  -P, --prefix <prefix>       
  -C, --cache [cache-location]
 --init [oneshot]             


## Influence on cache
### 100% invalidate when different
  -c, --config [file]         
  --ignore-known [file]       
  --ts-config [file]          
  --webpack-config [file]     
  --ts-pre-compilation-deps   
  -v, --validate [file]       
  --preserve-symlinks         

### Invalidates when in cache, not in command 
(or more precise: when filters in cache yield a subset of command)
  -I, --include-only <regex>  
  -F, --focus <regex>         
  -R, --reaches <regex>       
  -x, --exclude <regex>       
  -X, --do-not-follow <regex> 
  -S, --collapse <regex>      
  -d, --max-depth <n>          (more precise: when cache.max-depth < command.max-depth OR cache.max-depth === 0)
  -M, --module-systems <items> (more precise: )

### Invalidates when not in cache, but in command
  -m, --metrics               

# options that are not available on the command line

## no influence on cache
- Anything in reporterOptions
- externalModuleResolutionStrategy (as it's not really used anymore IIRC)
- 

## influence on cache

- combinedDependencies
- enhancedResolveOptions
- exoticRequireStrings
- knownViolations
*/

function includeOnlyIsCompatible(pExistingFilter, pNewFilter) {
  return (
    !pExistingFilter || objectsAreEqual({ path: pExistingFilter }, pNewFilter)
  );
}
function optionIsCompatible(pExistingFilter, pNewFilter) {
  return !pExistingFilter || objectsAreEqual(pExistingFilter, pNewFilter);
}

function limitIsCompatible(pExistingLimit, pNewLimit) {
  return !pExistingLimit || pExistingLimit >= (pNewLimit || pExistingLimit + 1);
}

function metricsIsCompatible(pExistingMetrics, pNewMetrics) {
  return pExistingMetrics || pExistingMetrics === pNewMetrics;
}

/**
 *
 * @param {import("../../types/strict-options").IStrictCruiseOptions} pOldOptions
 * @param {import("../../types/strict-options").IStrictCruiseOptions} pNewOptions
 * @returns {boolean}
 */
// eslint-disable-next-line complexity
function optionsAreCompatible(pOldOptions, pNewOptions) {
  return (
    pOldOptions.args === pNewOptions.args &&
    pOldOptions.rulesFile === pNewOptions.rulesFile &&
    pOldOptions.tsPreCompilationDeps === pNewOptions.tsPreCompilationDeps &&
    pOldOptions.preserveSymlinks === pNewOptions.preserveSymlinks &&
    pOldOptions.combinedDependencies === pNewOptions.combinedDependencies &&
    metricsIsCompatible(pOldOptions.metrics, pNewOptions.metrics) &&
    // includeOnly suffers from a backwards compatibility disease
    includeOnlyIsCompatible(pOldOptions.includeOnly, pNewOptions.includeOnly) &&
    optionIsCompatible(pOldOptions.doNotFollow, pNewOptions.doNotFollow) &&
    optionIsCompatible(pOldOptions.moduleSystems, pNewOptions.moduleSystems) &&
    optionIsCompatible(pOldOptions.exclude, pNewOptions.exclude) &&
    optionIsCompatible(pOldOptions.focus, pNewOptions.focus) &&
    optionIsCompatible(pOldOptions.reaches, pNewOptions.reaches) &&
    optionIsCompatible(pOldOptions.highlight, pNewOptions.highlight) &&
    optionIsCompatible(pOldOptions.collapse, pNewOptions.collapse) &&
    limitIsCompatible(pOldOptions.maxDepth, pNewOptions.maxDepth) &&
    optionIsCompatible(
      pOldOptions.knownViolations,
      pNewOptions.knownViolations
    ) &&
    optionIsCompatible(
      pOldOptions.enhancedResolveOptions,
      pNewOptions.enhancedResolveOptions
    ) &&
    optionIsCompatible(
      pOldOptions.exoticRequireStrings,
      pNewOptions.exoticRequireStrings
    )
  );
}

module.exports = {
  optionsAreCompatible,
  filtersAreCompatible: optionIsCompatible,
  limitsAreCompatible: limitIsCompatible,
  metricsAreCompatible: metricsIsCompatible,
  includeOnlyFiltersAreCompatible: includeOnlyIsCompatible,
};
