import type { IBaselineViolations } from "./baseline-violations.mjs";
import type { ICacheOptions } from "./cache-options.mjs";
import type {
  IDoNotFollowType,
  IExcludeType,
  IFocusType,
  IHighlightType,
  IIncludeOnlyType,
  IReachesType,
} from "./filter-types.mjs";
import type { IReporterOptions } from "./reporter-options.mjs";
import type { IFlattenedRuleSet } from "./rule-set.mjs";
import type { ModuleSystemType, OutputType } from "./shared-types.mjs";

export type ExternalModuleResolutionStrategyType = "node_modules" | "yarn-pnp";
export type ProgressType =
  | "cli-feedback"
  | "performance-log"
  | "ndjson"
  | "none";
export type ParserType = "acorn" | "tsc" | "swc";

export interface ITsConfig {
  fileName?: string;
}

export interface IBabelConfig {
  fileName?: string;
}

/**
 * The 'env' parameters passed to webpack, if any
 */
export type WebpackEnvType = { [key: string]: any } | string;

/**
 * The webpack configuration options used for the cruise
 */
export interface IWebpackConfig {
  /**
   * The arguments used
   */
  arguments?: { [key: string]: any };
  /**
   * The 'env' parameters passed
   */
  env?: WebpackEnvType;
  /**
   * The name of the webpack configuration file used
   */
  fileName?: string;
}

export interface ICruiseOptions {
  /**
   * if true, will attempt to validate with the rules in ruleSet.
   * Default false.
   */
  validate?: boolean;
  /**
   * An object containing the rules to validate against.
   *
   * This ain't in none of the json schemas, but is used internally _instead_
   * of the rule set defined on global configuration level. Judo
   * (a.o. flattening out extended rule sets) done in ../src/cli/normalize-cli-options.mjs
   */
  ruleSet?: IFlattenedRuleSet;
  /**
   * The (root) configuration file the cruise options came from.
   */
  rulesFile?: string;
  /**
   * regular expression describing which dependencies the function
   * should cruise, but not resolve or follow any further
   *
   * ... or conditions that describe what dependencies not to follow
   */
  doNotFollow?: string | string[] | IDoNotFollowType;
  /**
   * regular expression describing which dependencies the function
   * should not cruise
   */
  exclude?: string | string[] | IExcludeType;
  /**
   * regular expression describing which dependencies the function
   * should cruise - anything not matching this will be skipped
   */
  includeOnly?: string | string[] | IIncludeOnlyType;
  /**
   * dependency-cruiser will include modules matching this regular expression
   * in its output, as well as their neighbours (direct dependencies and
   * dependents)
   */
  focus?: string | string[] | IFocusType;
  /**
   * dependency-cruiser will include modules matching this regular expression
   * in its output, as well as _any_ module that reaches them - either directly
   * or via via.
   */
  reaches?: string | string[] | IReachesType;
  /**
   * dependency-cruiser will mark modules matching this regular expression
   * as 'highlighted' in its output
   */
  highlight?: string | string[] | IHighlightType;
  /*
   * baseline of known validations. Typically you'd specify these in a file called
   * .dependency-cruiser-known-violations.json (which you'd generate with the --outputType
   * 'baseline') - and which is easy to keep up to date. In a pinch you can specify
   * them here as well. The known violations in .dependency-cruiser-known-violations.json
   * always take precedence.
   */
  knownViolations?: IBaselineViolations;
  /**
   * collapse a to a folder depth by passing a single digit (e.g. 2).
   * When passed a regex collapse to that pattern
   *
   * E.g. ^packages/[^/]+/ would collapse to modules/ folders directly under
   * your packages folder.
   */
  collapse?: string | number;
  /**
   * the maximum depth to cruise; 0 <= n <= 99
   * (default: 0, which means 'infinite depth')
   * While it might look attractive to regulate the size of the output, this is
   * not the best option to do so.
   *
   * Filters (exclude, includeOnly, focus), the dot and archi reporter's collapsePattern
   * and the collapse options offer better, more reliable and more
   * understandable results.
   */
  maxDepth?: number | string;
  /**
   * an array of module systems to use for following dependencies;
   * defaults to ["es6", "cjs", "amd"]
   */
  moduleSystems?: ModuleSystemType[];
  /**
   * one of "json", "html", "dot", "csv" or "err". When left
   * out the function will return a javascript object as dependencies
   */
  outputType?: OutputType;
  /**
   * Where the output of the cruise is to be sent to. '-' (the default)
   * denotes stdout.
   *
   * Echoed in the result schema, but not used internally otherwise.
   */
  outputTo?: string;
  /**
   * The arguments used on the command line
   *
   * Echoed in the result schema, but not used internally otherwise.
   */
  args?: string;
  /**
   * The directory dependency-cruiser should run its cruise from. Defaults
   * to the current working directory.
   */
  baseDir?: string;
  /**
   * a string to insert before links (in dot/ svg output) so with
   * cruising local dependencies it is possible to point to sources
   * elsewhere (e.g. in an online repository)
   */
  prefix?: string;
  /**
   * if true detect dependencies that only exist before
   * typescript-to-javascript compilation.
   */
  tsPreCompilationDeps?: boolean | "specify";
  /**
   * List of extensions to scan _in addition_ to the extensions already
   * covered by any available parser. Dependency-cruiser will consider files
   * ending in these extensions but it will _not_ examine its content or
   * derive any of their dependencies
   * Sample value: [".jpg", ".png", ".json"]
   */
  extraExtensionsToScan?: string[];
  /**
   * if true leave symlinks untouched, otherwise use the realpath.
   * Defaults to `false` (which is also nodejs's default behavior
   * since version 6)
   */
  preserveSymlinks?: boolean;
  /**
   * The way to resolve external modules - either via node_modules
   * ('node_modules') or yarn plug and play ('yarn-pnp').
   *
   * Defaults to 'node_modules'
   * @deprecated now works automatically
   */
  externalModuleResolutionStrategy?: ExternalModuleResolutionStrategyType;
  /**
   * Options to tweak what dependency-cruiser considers 'built-in' modules. If
   * you're targeting nodejs, or don't use any built-in modules you can probably
   * leave this alone.
   */
  builtInModules?: {
    /**
     * List of module names that are to be considered as 'built-in'. By default dependency-cruiser
     * uses the list of built-ins from nodejs. If you code for another environment (e.g. the
     * browser) and you use shims for nodejs builtins like 'path' from node_modules, you could
     * pass an empty array here. If you want to just add a couple of extra built-ins to
     * the default list, use the 'add' attribute instead.
     */
    override: string[];
    /**
     * List of module names that are to be considered as 'built-in' in addition to the default
     * list of the environment you're currently in. Use this e.g. if you're writing
     * electron code and want to add 'electron' as built-in.
     */
    add: string[];
  };
  /**
   * When true includes denormalized dependents in the cruise-result, even
   * though there's no rule in the rule set that requires them. Defaults to false.
   */
  forceDeriveDependents?: boolean;
  /**
   * if true combines the package.jsons found from the module up to the base
   * folder the cruise is initiated from. Useful for how (some) mono-repos
   * manage dependencies & dependency definitions.
   *
   * Defaults to `false`.
   */
  combinedDependencies?: boolean;
  /*
   * List of strings you have in use in addition to cjs/ es6 requires
   * & imports to declare module dependencies. Use this e.g. if you've
   * re-declared require (`const want = require`), use a require-wrapper
   * (like semver-try-require) or use window.require as a hack
   *
   * Defaults to `[]`
   */
  exoticRequireStrings?: string[];
  /**
   * Options to tweak the output of reporters
   */
  reporterOptions?: IReporterOptions;

  /**
   * TypeScript project file ('tsconfig.json') to use for (1) compilation
   * and (2) resolution (e.g. with the paths property)",
   */
  tsConfig?: ITsConfig;

  /**
   * Webpack configuration to use to get resolve options from
   */
  webpackConfig?: IWebpackConfig;

  /**
   * Babel configuration (e.g. '.babelrc.json') to use.
   */
  babelConfig?: IBabelConfig;

  /**
   * Overrides the parser dependency-cruiser will use - EXPERIMENTAL
   *
   * Note that you'll _very_ likely not need this - dependency-cruiser will
   * typically sort out what the best parser for the job is out of the ones
   * available
   */
  parser?: ParserType;

  /**
   * Options used in module resolution that for dependency-cruiser's
   * use cannot go in a webpack config.
   */
  enhancedResolveOptions?: {
    /**
     * "List of strings to consider as 'exports' fields in package.json. Use
     * `['exports']` when you use packages that use such a field and your environment
     * supports it (e.g. node ^12.19 || >=14.7 or recent versions of webpack).
     */
    exportsFields?: string[];
    /**
     * List of conditions to check for in the exports field. e.g. use `['imports']`
     * if you're only interested in exposed es6 modules, `['require']` for commonjs,
     * or all conditions at once (`['import', 'require', 'node', 'default']`)
     * if anything goes for you. Only works when the 'exportsFields' array is non-empty
     */
    conditionNames?: string[];
    /**
     * List of extensions to scan for when resolving. Typically you want to leave
     * this alone as dependency-cruiser figures out what extensions to scan based
     * on
     * 1. what is available in your environment,
     * 2. in the order your environment (nodejs, typescript) applies the resolution itself.
     *
     * However if you want it to scan less you can specify so with the extensions
     * attribute. E.g. when you're 100% sure you _only_ have typescript & json
     * and nothing else you can pass `['.ts', '.json']` - which can lead to performance
     * gains on systems with slow i/o (like ms-windows), especially when your
     * tsconfig contains paths/ aliases.
     */
    extensions?: string[];
    /**
     * A list of main fields in manifests (package.json s). Typically you'd want
     * to keep leave this this on its default (['main']) , but if you e.g. use
     * external packages that only expose types, and you still want references
     * to these types to be resolved you could expand this to
     * ['main', 'types', 'typings']
     */
    mainFields?: string[];
    /**
     * A list of files to consider 'main' files, defaults to ['index']. Only set
     * this when you have really special needs that warrant it.
     */
    mainFiles?: string[];
    /**
     * A list of alias fields in manifests (package.jsons).
     * Specify a field, such as browser, to be parsed according to
     * [this specification](https://github.com/defunctzombie/package-browser-field-spec).
     * Also see [resolve.alias](https://webpack.js.org/configuration/resolve/#resolvealiasfields)
     * in the webpack docs.
     *
     * Defaults to an empty array (don't use any alias fields).
     */
    aliasFields?: string[];
    /**
     * Options to pass to the resolver (webpack's 'enhanced resolve') regarding
     * caching.
     */
    cachedInputFileSystem?: {
      /**
       * The number of milliseconds [enhanced-resolve](webpack/enhanced-resolve)'s
       * cached file system should use for cache duration. Typically you won't
       * have to touch this - the default works well for repos up to 5000 modules/
       * 20000 dependencies, and likely for numbers above as well.
       *
       * If you experience memory problems on a (humongous) repository you can
       * use the cacheDuration attribute to tame enhanced-resolve's memory
       * usage by lowering the cache duration trading off against some (for
       * values over 1000ms) or significant (for values below 500ms) performance.
       *
       * Dependency-cruiser currently uses 1000ms, and in the past has
       * used 4000ms - both with good results.
       */
      cacheDuration: number;
    };
  };

  /**
   * Whether or not to show progress feedback when the command line
   * app is running.
   */
  progress?: {
    /**
     * The type of progress to show; `none` to not show anything at all;
     * `cli-feedback` to show a progress bar on stderr that disappears when
     * processing is done or `performance-log` to print timings and memory usage
     * of each major step to stderr.
     */
    type: ProgressType;
    /**
     * The maximum log level to emit messages at. Ranges from OFF (-1, don't " +
     * show any messages), via SUMMARY (40), INFO (50), DEBUG (60) all the " +
     * way to show ALL messages (99)."
     */
    maximumLevel?: -1 | 40 | 50 | 60 | 70 | 80 | 99;
  };

  /**
   * When this flag is set to true, dependency-cruiser will calculate (stability) metrics
   * for all modules and folders. Defaults to false.
   */
  metrics?: boolean;

  /**
   * When this flag is set to true, dependency-cruiser will calculate some " +
   * stats for each module. Has some performance impact. EXPERIMENTAL " +
   * Will be renamed when the 'experimental' state is lifted." +
   * Defaults to false.",*
   */
  experimentalStats?: boolean;

  /**
   * - false: don't use caching.
   * - true or empty object: use caching with the default settings
   * - a string (deprecated): cache in the folder denoted by the string & use the
   *   default caching strategy. This is deprecated - instead pass a cache object
   *   e.g. ```{ folder: 'your/cache/location' }```
   *
   * Defaults to false.
   * When caching is switched on the default cache folder is 'node_modules/.cache/dependency-cruiser/'
   */
  cache?: boolean | string | Partial<ICacheOptions>;
}

export interface IFormatOptions {
  /**
   * regular expression describing which dependencies the function
   * should not cruise
   */
  exclude?: string | string[] | IExcludeType;
  /**
   * regular expression describing which dependencies the function
   * should cruise - anything not matching this will be skipped
   */
  includeOnly?: string | string[] | IIncludeOnlyType;
  /**
   * dependency-cruiser will include modules matching this regular expression
   * in its output, as well as their neighbours (direct dependencies and
   * dependents)
   */
  focus?: string | string[] | IFocusType;
  /**
   * dependency-cruiser will include modules matching this regular expression
   * in its output, as well as _any_ module that reaches them - either directly
   * or via via.
   */
  reaches?: string | string[] | IReachesType;
  /**
   * collapse a to a folder depth by passing a single digit (e.g. 2).
   * When passed a regex collapse to that pattern
   *
   * E.g. ^packages/[^/]+/ would collapse to modules/ folders directly under
   * your packages folder.
   */
  collapse?: string | number;
  /**
   * one of "json", "html", "dot", "csv" or "err". When left
   * out the function will return a javascript object as dependencies
   */
  outputType?: OutputType;
  /**
   * a string to insert before links (in dot/ svg output) so with
   * cruising local dependencies it is possible to point to sources
   * elsewhere (e.g. in an online repository)
   */
  prefix?: string;
}
