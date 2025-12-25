# cache format versioning

The cache format is a _number_ because it's trivial to compare (`<`/ `>`) a.c.t.
semver strings.

Bump ./cache.mjs#CACHE_FORMAT_VERSION to the current major.minor version when the 
cache format changes in a way that's not backwards compatible. E.g. version 
- 3.0.0 => 3
- version 3.1.0 => 3.1
- version 3.1.1 => 3.1
- version 3.11.0 => 3.11
That way it's clear in which dependency-cruiser version the cache format changed
up the last way

This means we assume breaking cache format versions won't occur in patch 
releases. If worst case scenario it _is_ necessary we could add the patch version 
divided by 1000_000 e.g. 
- version 3.14.16 => 3.14 + 16/1000_000 = 3.140016

# cache compression

## algorithm: brotli, min quality
we landed on brotli with BROTLI_MIN_QUALITY because:
- even with BROTLI_MIN_QUALITY it compresses better than gzip (regardless of compression level)
- at BROTLI_MIN_QUALITY it's faster than gzip
- BROTLI_MAX_QUALITY gives a bit better compression but is _much_ slower than even gzip
       

## sync vs async: sync
In our situation the sync version is significantly faster than the async version + 
zlib functions need to be promisified before they can be used in promises, which 
will add the to the execution time as well. As sync or async doesn't _really_ matter
for the cli, we're using the sync version.
       
# cache dirty considerations

## command line options
### No influence on cache
  -i, --info                  
  -V, --version               
  -h, --help         
  -T, --output-type <type>    unless counting implicit shizzle like dependents, metrics calculation
  -f, --output-to <file>      
  -p, --progress [type]       
  -P, --prefix <prefix>       
  -C, --cache [cache-location]
 --init [oneshot]             


### Influence on cache
#### 100% invalidate when different
  -c, --config [file]         
  --ignore-known [file]       
  --ts-config [file]          
  --webpack-config [file]     
  --ts-pre-compilation-deps   
  -v, --validate [file]       
  --preserve-symlinks         

#### Invalidates when in cache, not in command 
(or more precise: when filters in cache yield a subset of command)
  -I, --include-only <regex>  
  -F, --focus <regex>         
  -R, --reaches <regex>       
  -x, --exclude <regex>       
  -X, --do-not-follow <regex> 
  -S, --collapse <regex>      
  -d, --max-depth <n>          (more precise: when cache.max-depth < command.max-depth OR cache.max-depth === 0)
  -M, --module-systems <items> (more precise: )

#### Invalidates when not in cache, but in command
  -m, --metrics               

## options that are not available on the command line

### no influence on cache
- Anything in reporterOptions
- externalModuleResolutionStrategy (as it's not really used anymore IIRC)

### influence on cache

- combinedDependencies
- enhancedResolveOptions
- exoticRequireStrings
- knownViolations