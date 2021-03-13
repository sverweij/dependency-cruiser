import { IReporterOptions } from "./reporter-options";
import { IFlattenedRuleSet } from "./rule-set";
import { ModuleSystemType, OutputType } from "./shared-types";
import {
  IDoNotFollowType,
  IExcludeType,
  IFocusType,
  IIncludeOnlyType,
} from "./filter-types";

export type ExternalModuleResolutionStrategyType = "node_modules" | "yarn-pnp";
export type ProgressType =
  | /** yo with the banjo*/
  "cli-feedback" /** mean with the mandoline */
  | "performance-log"
  | "none";

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
   * (a.o. flattening out extended rule sets) done in ../src/cli/normalize-options.js
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
  maxDepth?: number;
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
   * redeclared require (`const want = require`), use a require-wrapper
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
     * tsconfig contains paths/ aliasses.
     */
    extensions?: string[];
    /**
     * Options to pass to the resolver (webpack's 'enhanced resolve') regarding
     * caching.
     */
    cachedInputFileSystem?: {
      /**
       * The number of milliseconds [enhanced-resolve](webpack/enhanced-resolve)'s
       * cached file system should use for cache duration. Typicially you won't
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
  };
}
