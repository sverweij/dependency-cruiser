# command line options
## No influence on cache
  -i, --info                  
  -V, --version               
  -h, --help         
  -T, --output-type <type>    unless counting implicit shizzle like dependents, metrics calculation
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