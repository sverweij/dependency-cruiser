import { IFlattenedRuleSet } from "./rule-set";
import { DependencyType, ModuleSystemType, OutputType } from "./shared-types";

export type ExternalModuleResolutionStrategyType = "node_modules" | "yarn-pnp";

export interface IRuleSetType extends IFlattenedRuleSet {
  /**
   * A (node require resolvable) file path to a dependency-cruiser config
   * that serves as the base for this one...
   * ... or an array of these
   */
  extends?: string | string[];
  /**
   * Runtime configuration options
   */
  options?: ICruiseOptions;
}

export interface IDoNotFollowType {
  /**
   * a regular expression for modules to include, but not follow further
   */
  path?: string;
  /**
   * an array of dependency types to include, but not follow further
   */
  dependencyTypes?: DependencyType;
}

export interface IExcludeType {
  /**
   * a regular expression for modules to exclude
   */
  path?: string;
  /**
   * a boolean indicating whether or not to exclude dynamic dependencies
   * leave out to match both
   */
  dynamic?: boolean;
}

export interface ICruiseOptions {
  /**
   * if true, will attempt to validate with the rules in ruleSet.
   * Default false.
   */
  validate?: boolean;
  /**
   * An object containing the rules to validate against. The rules
   * should adhere to the
   * [ruleset schema](https://github.com/sverweij/dependency-cruiser/blob/develop/src/main/ruleSet/jsonschema.json)
   */
  ruleSet?: IRuleSetType;
  /**
   * regular expression describing which dependencies the function
   * should cruise, but not resolve or follow any further
   *
   * ... or conditions that describe what dependencies not to follow
   */
  doNotFollow?: string | IDoNotFollowType;
  /**
   * regular expression describing which dependencies the function
   * should not cruise
   */
  exclude?: string | IExcludeType;
  /**
   * regular expression describing which dependencies the function
   * should cruise - anything not matching this will be skipped
   */
  includeOnly?: string;
  /**
   * the maximum depth to cruise; 0 <= n <= 99
   * (default: 0, which means 'infinite depth')
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
   * Might later also include npm's tink (?)
   *
   * Defaults to 'node_modules'
   */
  externalModuleResolutionStrategy?: ExternalModuleResolutionStrategyType;
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
   * (API only) when set to `true` forces the extraction module to
   * detect circular dependencies even when there is no rule in the rule
   * set that requires it.
   *
   * Defaults to `false`
   */
  forceCircularCheck?: boolean;
  /**
   * (API only) when set to `true` forces the extraction module to
   * detect orphan modules even when there is no rule in the rule
   * set that requires it
   *
   * Defaults to `false`
   */
  forceOrphanCheck?: boolean;
}
