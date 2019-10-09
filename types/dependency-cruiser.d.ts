/**
 * all supported extensions; for each extension whether or not
 * it is supported in the current environment
 */
export const allExtensions: IAvailableExtension[];

export interface IAvailableExtension {
  /**
   * File extension (e.g. ".js", ".ts", ".jsx")
   */
  extension: string;
  /**
   * Whether or not the extension is available as supported in the current environment
   */
  available: boolean;
}

export interface IAvailableTranspiler {
  /**
   * The name of the transpiler (e.g. "typescript", "coffeescript")
   */
  name: string;
  /**
   * A semver version range (e.g. ">=2.0.0 <3.0.0")
   */
  version: string;
  /**
   * Whether or not the transpiler is available in the current environment
   */
  available: boolean;
}

export type ModuleSystemType = "cjs" | "amd" | "es6" | "tsd";

export type OutputType =
  | "json"
  | "html"
  | "dot"
  | "ddot"
  | "csv"
  | "err"
  | "err-html"
  | "teamcity";

export type SeverityType = "error" | "warn" | "info" | "ignore";

export type DependencyType =
  | "aliased"
  | "core"
  | "deprecated"
  | "local"
  | "localmodule"
  | "npm"
  | "npm-bundled"
  | "npm-dev"
  | "npm-no-pkg"
  | "npm-optional"
  | "npm-peer"
  | "npm-unknown"
  | "undetermined"
  | "unknown";

export type ExternalModuleResolutionStrategyType = "node_modules" | "yarn-pnp";

export interface IFromRestriction {
  /**
   * A regular expression an end of a dependency should match to be catched by this rule.
   */
  path?: string;
  /**
   * A regular expression an end of a dependency should NOT match to be catched by this rule.
   */
  pathNot?: string;
  /**
   * Whether or not to match when the module is an orphan (= has no incoming or outgoing
   * dependencies). When this property it is part of a rule, dependency-cruiser will
   * ignore the 'to' part.
   */
  orphan?: boolean;
}

export interface IToRestriction {
  /**
   * A regular expression an end of a dependency should match to be catched by this rule.
   */
  path?: string;
  /**
   * A regular expression an end of a dependency should NOT match to be catched by this rule.
   */
  pathNot?: string;
  /**
   * Whether or not to match modules dependency-cruiser could not resolve (and probably
   * aren't on disk). For this one too: leave out if you don't care either way.
   */
  couldNotResolve?: boolean;
  /**
   * Whether or not to match when following to the to will ultimately end up in the from.
   */
  circular?: boolean;
  /**
   * If following this dependency will ultimately return to the source
   * (circular === true), this attribute will contain an (ordered) array of module
   * names that shows (one of the) circular path(s)
   */
  cycle?: string[];
  /**
   * Whether or not to match when the dependency is a dynamic one.
   */
  dynamic?: boolean;
  /**
   * Whether or not to match modules of any of these types (leaving out matches any of them)
   */
  dependencyTypes?: DependencyType[];
  /**
   * If true matches dependencies with more than one dependency type (e.g. defined in
   * _both_ npm and npm-dev)
   */
  moreThanOneDependencyType?: boolean;
  /**
   * Whether or not to match modules that were released under one of the mentioned
   * licenses. E.g. to flag GPL-1.0, GPL-2.0 licensed modules (e.g. because your app
   * is not compatible with the GPL) use "GPL"
   */
  license?: string;
  /**
   * Whether or not to match modules that were NOT released under one of the mentioned
   * licenses. E.g. to flag everyting non MIT use "MIT" here
   */
  licenseNot?: string;
}

export interface IReachabilityFromRestrictionType {
  /**
   * A regular expression an end of a dependency should match to be catched by this rule.
   */
  path?: string;
  /**
   * A regular expression an end of a dependency should NOT match to be catched by this rule.
   */
  pathNot?: string;
}

export interface IReachabilityToRestrictionType {
  /**
   * A regular expression an end of a dependency should match to be catched by this rule.
   */
  path?: string;
  /**
   * A regular expression an end of a dependency should NOT match to be catched by this rule.
   */
  pathNot?: string;
  /**
   * Whether or not to match modules that aren't reachable from the from part of the rule.
   */
  reachable: boolean;
}

export type IAllowedRuleType =
  | IRegularAllowedRuleType
  | IReachabilityAllowedRuleType;

export interface IRegularAllowedRuleType {
  /**
   * You can use this field to document why the rule is there.
   */
  comment?: string;
  /**
   * Criteria the 'from' end of a dependency should match to be caught by this rule.
   * Leave it empty if you want any module to be matched.
   */
  from: IFromRestriction;
  /**
   * Criteria the 'to' end of a dependency should match to be caught by this rule.
   * Leave it empty if you want any module to be matched.
   */
  to: IToRestriction;
}

export interface IReachabilityAllowedRuleType {
  /**
   * You can use this field to document why the rule is there.
   */
  comment?: string;
  /**
   * Criteria the 'from' end of a dependency should match to be caught by this rule.
   * Leave it empty if you want any module to be matched.
   */
  from: IReachabilityFromRestrictionType;
  /**
   * Criteria the 'to' end of a dependency should match to be caught by this rule.
   * Leave it empty if you want any module to be matched.
   */
  to: IReachabilityToRestrictionType;
}

export type IForbiddenRuleType =
  | IRegularForbiddenRuleType
  | IReachabilityForbiddenRuleType;

export interface IRegularForbiddenRuleType {
  /**
   * A short name for the rule - will appear in reporters to enable customers to
   * quickly identify a violated rule. Try to keep them short, eslint style.
   * E.g. 'not-to-core' for a rule forbidding dependencies on core modules, or
   * 'not-to-unresolvable' for one that prevents dependencies on modules that
   * probably don't exist.
   */
  name?: string;
  /**
   * How severe a violation of the rule is. The 'error' severity will make some
   * reporters return a non-zero exit code, so if you want e.g. a build to stop
   * when there's a rule violated: use that.
   */
  severity?: SeverityType;
  /**
   * You can use this field to document why the rule is there.
   */
  comment?: string;
  /**
   * Criteria the 'from' end of a dependency should match to be caught by this
   * rule. Leave it empty if you want any module to be matched.
   */
  from: IFromRestriction;
  /**
   * Criteria the 'to' end of a dependency should match to be caught by this
   * rule. Leave it empty if you want any module to be matched.
   */
  to: IToRestriction;
}

export interface IReachabilityForbiddenRuleType {
  /**
   * A short name for the rule - will appear in reporters to enable customers to
   * quickly identify a violated rule. Try to keep them short, eslint style.
   * E.g. 'not-to-core' for a rule forbidding dependencies on core modules, or
   * 'not-to-unresolvable' for one that prevents dependencies on modules that
   * probably don't exist.
   */
  name?: string;
  /**
   * How severe a violation of the rule is. The 'error' severity will make some
   * reporters return a non-zero exit code, so if you want e.g. a build to stop
   * when there's a rule violated: use that.
   */
  severity?: SeverityType;
  /**
   * You can use this field to document why the rule is there.
   */
  comment?: string;
  /**
   * Criteria the 'from' end of a dependency should match to be caught by this
   * rule. Leave it empty if you want any module to be matched.
   */
  from: IReachabilityFromRestrictionType;
  /**
   * Criteria the 'to' end of a dependency should match to be caught by this
   * rule. Leave it empty if you want any module to be matched.
   */
  to: IReachabilityToRestrictionType;
}

export interface IRuleSetType {
  /**
   * A (node require resolvable) file path to a dependency-cruiser config
   * that serves as the base for this one...
   * ... or an array of these
   */
  extends?: string | string[];
  /**
   * A list of rules that describe dependencies that are not allowed.
   * dependency-cruiser will emit a separate error (warning/ informational)
   * messages for each violated rule.
   */
  forbidden?: IForbiddenRuleType[];
  /**
   * A list of rules that describe dependencies that are allowed.
   * dependency-cruiser will emit the warning message 'not-in-allowed' for
   * each dependency that does not at least one of them.
   */
  allowed?: IAllowedRuleType[];
  /**
   * Severity to use when a dependency is not in the 'allowed' set of rules.
   * Defaults to 'warn'
   */
  allowedSeverity?: SeverityType;
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
  tsPreCompilationDeps?: boolean;
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
export interface ICruiseResult {
  /**
   * A list of modules, with for each module the modules it depends upon
   */
  modules: Module[];
  /**
   * Data summarizing the found dependencies
   */
  summary: Summary;
}

export interface Module {
  /**
   * Whether or not this is a node.js core module
   */
  coreModule?: boolean;
  /**
   * 'true' if dependency-cruiser could not resolve the module name in the source code to a
   * file name or core module. 'false' in all other cases.
   */
  couldNotResolve?: boolean;
  dependencies:     Dependency[];
  /**
   * the type of inclusion - local, core, unknown (= we honestly don't know), undetermined (=
   * we didn't bother determining it) or one of the npm dependencies defined in a package.jsom
   * ('npm' for 'depenencies', 'npm-dev', 'npm-optional', 'npm-peer', 'npm-no-pkg' for
   * development, optional, peer dependencies and dependencies in node_modules but not in
   * package.json respectively)
   */
  dependencyTypes?: DependencyType[];
  /**
   * Whether or not this is a dependency that can be followed any further. This will be
   * 'false' for for core modules, json, modules that could not be resolved to a file and
   * modules that weren't followed because it matches the doNotFollow expression.
   */
  followable?: boolean;
  /**
   * the license, if known (usually known for modules pulled from npm, not for local ones)
   */
  license?: string;
  /**
   * 'true' if the file name of this module matches the doNotFollow regular expression
   */
  matchesDoNotFollow?: boolean;
  /**
   * 'true' if this module does not have dependencies, and no module has it as a dependency
   */
  orphan?: boolean;
  /**
   * An array of objects that tell whether this module is 'reachable', and according to rule
   * in which this reachability was defined
   */
  reachable?: ReachableType[];
  /**
   * an array of rules violated by this module - left out if the module is valid
   */
  rules?: RuleSummaryType[];
  /**
   * The (resolved) file name of the module, e.g. 'src/main/index.js'
   */
  source: string;
  /**
   * 'true' if this module violated a rule; 'false' in all other cases. The violated rule will
   * be in the 'rule' object at the same level.
   */
  valid: boolean;
}

export interface Dependency {
  /**
   * 'true' if following this dependency will ultimately return to the source, false in all
   * other cases
   */
  circular?: boolean;
  /**
   * Whether or not this is a node.js core module - deprecated in favor of dependencyType ===
   * core
   */
  coreModule: boolean;
  /**
   * 'true' if dependency-cruiser could not resulve the module name in the source code to a
   * file name or core module. 'false' in all other cases.
   */
  couldNotResolve: boolean;
  /**
   * If following this dependency will ultimately return to the source (circular === true),
   * this attribute will contain an (ordered) array of module names that shows (one of the)
   * circular path(s)
   */
  cycle?: string[];
  /**
   * the type of inclusion - local, core, unknown (= we honestly don't know), undetermined (=
   * we didn't bother determining it) or one of the npm dependencies defined in a package.jsom
   * ('npm' for 'depenencies', 'npm-dev', 'npm-optional', 'npm-peer', 'npm-no-pkg' for
   * development, optional, peer dependencies and dependencies in node_modules but not in
   * package.json respectively)
   */
  dependencyTypes: DependencyType[];
  /**
   * true if this dependency is dynamic, false in all other cases
   */
  dynamic: boolean;
  /**
   * Whether or not this is a dependency that can be followed any further. This will be
   * 'false' for for core modules, json, modules that could not be resolved to a file and
   * modules that weren't followed because it matches the doNotFollow expression.
   */
  followable: boolean;
  /**
   * the license, if known (usually known for modules pulled from npm, not for local ones)
   */
  license?: string;
  /**
   * 'true' if the file name of this module matches the doNotFollow regular expression
   */
  matchesDoNotFollow?: boolean;
  /**
   * The name of the module as it appeared in the source code, e.g. './main'
   */
  module:       string;
  moduleSystem: ModuleSystemType;
  /**
   * The (resolved) file name of the module, e.g. 'src/main//index.js'
   */
  resolved: string;
  /**
   * an array of rules violated by this dependency - left out if the dependency is valid
   */
  rules?: RuleSummaryType[];
  /**
   * 'true' if this dependency violated a rule; 'false' in all other cases. The violated rule
   * will be in the 'rule' object at the same level.
   */
  valid: boolean;
}

/**
* If there was a rule violation (valid === false), this object contains the name of the
* rule and severity of violating it.
*/
export interface RuleSummaryType {
  /**
   * The (short, eslint style) name of the violated rule. Typically something like
   * 'no-core-punycode' or 'no-outside-deps'.
   */
  name:     string;
  severity: SeverityType;
}

/**
* How severe a violation of a rule is. The 'error' severity will make some reporters return
* a non-zero exit code, so if you want e.g. a build to stop when there's a rule violated:
* use that. The absence of the 'ignore' severity here is by design; ignored rules don't
* show up in the output.
*
* Severity to use when a dependency is not in the 'allowed' set of rules. Defaults to 'warn'
*/

export interface ReachableType {
  /**
   * The name of the rule where the reachability was defined
   */
  asDefinedInRule: string;
  /**
   * 'true' if this module is reachable from any of the modules matched by the from part of a
   * reachability-rule in 'asDefinedInRule', 'false' if not.
   */
  value: boolean;
}

/**
* Data summarizing the found dependencies
*/
export interface Summary {
  /**
   * the number of errors in the dependencies
   */
  error: number;
  /**
   * the number of informational level notices in the dependencies
   */
  info:        number;
  optionsUsed: OptionsType;
  /**
   * rules used in the cruise
   */
  ruleSetUsed?: RuleSetUsed;
  /**
   * the number of modules cruised
   */
  totalCruised: number;
  /**
   * the number of dependencies cruised
   */
  totalDependenciesCruised?: number;
  /**
   * A list of violations found in the dependencies. The dependencies themselves also contain
   * this information, this summary is here for convenience.
   */
  violations: ViolationType[];
  /**
   * the number of warnings in the dependencies
   */
  warn: number;
}

/**
* the (command line) options used to generate the dependency-tree
*/
export interface OptionsType {
  /**
   * arguments passed on the command line
   */
  args?:                 string;
  combinedDependencies?: boolean;
  /**
   * Criteria for modules to include, but not to follow further
   */
  doNotFollow?: DoNotFollow;
  /**
   * Criteria for dependencies to exclude
   */
  exclude?: Exclude;
  /**
   * What external module resolution strategy to use. Defaults to 'node_modules'
   */
  externalModuleResolutionStrategy?: ExternalModuleResolutionStrategyType;
  /**
   * a regular expression for modules to cruise; anything outside it will be skipped
   */
  includeOnly?: string;
  /**
   * The maximum cruise depth specified. 0 means no maximum specified
   */
  maxDepth?:      number;
  moduleSystems?: ModuleSystemType[];
  /**
   * File the output was written to ('-' for stdout)
   */
  outputTo?:         string;
  outputType?:       OutputType;
  prefix?:           string;
  preserveSymlinks?: boolean;
  /**
   * The rules file used to validate the dependencies (if any)
   */
  rulesFile?:            string;
  tsConfig?:             TsConfig;
  tsPreCompilationDeps?: boolean;
  /**
   * The webpack configuration options used for the cruise
   */
  webpackConfig?: WebpackConfig;
}

/**
* Criteria for modules to include, but not to follow further
*/
export interface DoNotFollow {
  /**
   * an array of dependency types to include, but not follow further
   */
  dependencyTypes?: DependencyType[];
  /**
   * a regular expression for modules to include, but not follow further
   */
  path?: string;
}

/**
* Criteria for dependencies to exclude
*/
export interface Exclude {
  /**
   * a boolean indicating whether or not to exclude dynamic dependencies
   */
  dynamic?: boolean;
  /**
   * a regular expression for modules to exclude from being cruised
   */
  path?: string;
}

export interface TsConfig {
  fileName?: string;
}

/**
* The webpack configuration options used for the cruise
*/
export interface WebpackConfig {
  /**
   * The arguments used
   */
  arguments?: { [key: string]: any };
  /**
   * The 'env' parameters passed
   */
  env?: Env;
  /**
   * The name of the webpack configuration file used
   */
  fileName?: string;
}

/**
* The 'env' parameters passed
*/
export type Env = { [key: string]: any } | string;

/**
* rules used in the cruise
*/
export interface RuleSetUsed {
  /**
   * A list of rules that describe dependencies that are allowed. dependency-cruiser will emit
   * the warning message 'not-in-allowed' for each dependency that does not at least meet one
   * of them.
   */
  allowed?: RuleType[];
  /**
   * Severity to use when a dependency is not in the 'allowed' set of rules. Defaults to 'warn'
   */
  allowedSeverity?: SeverityType;
  /**
   * A list of rules that describe dependencies that are not allowed. dependency-cruiser will
   * emit a separate error (warning/ informational) messages for each violated rule.
   */
  forbidden?: ForiddenRuleType[];
}

export interface RuleType {
  comment?: string;
  from:     FromRestrictionType;
  to:       ToRestrictionType;
}

/**
* Criteria an end of a dependency should match to be caught by this rule. Leave it empty if
* you want any module to be matched.
*/
export interface FromRestrictionType {
  /**
   * Whether or not to match when the module is an orphan (= has no incoming or outgoing
   * dependencies). When this property it is part of a rule, dependency-cruiser will ignore
   * the 'to' part.
   */
  orphan?: boolean;
  /**
   * A regular expression an end of a dependency should match to be catched by this rule.
   */
  path?: string;
  /**
   * A regular expression an end of a dependency should NOT match to be catched by this rule.
   */
  pathNot?: string;
}

/**
* Criteria the 'to' end of a dependency should match to be caught by this rule. Leave it
* empty if you want any module to be matched.
*/
export interface ToRestrictionType {
  /**
   * Whether or not to match when following to the to will ultimately end up in the from.
   */
  circular?: boolean;
  /**
   * Whether or not to match modules dependency-cruiser could not resolve (and probably aren't
   * on disk). For this one too: leave out if you don't care either way.
   */
  couldNotResolve?: boolean;
  /**
   * Whether or not to match modules of any of these types (leaving out matches any of them)
   */
  dependencyTypes?: DependencyType[];
  /**
   * true if this dependency is dynamic, false in all other cases
   */
  dynamic?: boolean;
  /**
   * Whether or not to match modules that were released under one of the mentioned licenses.
   * E.g. to flag GPL-1.0, GPL-2.0 licensed modules (e.g. because your app is not compatible
   * with the GPL) use "GPL"
   */
  license?: string;
  /**
   * Whether or not to match modules that were NOT released under one of the mentioned
   * licenses. E.g. to flag everyting non MIT use "MIT" here
   */
  licenseNot?: string;
  /**
   * If true matches dependencies with more than one dependency type (e.g. defined in _both_
   * npm and npm-dev)
   */
  moreThanOneDependencyType?: boolean;
  /**
   * A regular expression an end of a dependency should match to be catched by this rule.
   */
  path?: string;
  /**
   * A regular expression an end of a dependency should NOT match to be catched by this rule.
   */
  pathNot?: string;
  /**
   * Whether or not to match modules that aren't reachable from the from part of the rule.
   * NOTE & TODO: should be separate rule type that ensures there's only one, and that has
   * only path and pathNot in the to part
   */
  reachable?: boolean;
}

export interface ForiddenRuleType {
  /**
   * You can use this field to document why the rule is there.
   */
  comment?: string;
  from:     FromRestrictionType;
  /**
   * A short name for the rule - will appear in reporters to enable customers to quickly
   * identify a violated rule. Try to keep them short, eslint style. E.g. 'not-to-core' for a
   * rule forbidding dependencies on core modules, or 'not-to-unresolvable' for one that
   * prevents dependencies on modules that probably don't exist.
   */
  name?:     string;
  severity?: SeverityType;
  to:        ToRestrictionType;
}

export interface ViolationType {
  /**
   * The circular path if the violation was about circularity
   */
  cycle?: string[];
  from:   string;
  rule:   RuleSummaryType;
  to:     string;
}

export interface IReporterOutput {
  /**
   * The output proper of the reporter. For most reporters this will be
   * a string.
   */
  output: ICruiseResult | string;
  /**
   * The exit code - reporters can return a non-zero value when they find
   * errors here. api consumers (like a cli) can use this to return a
   * non-zero exit code, so the build breaks when something is wrong
   *
   * This is e.g. the default behavior of the `err` and `err-long` reporters.
   */
  exitCode: number;
}

/**
 * Cruises the specified files and files with supported extensions in
 * the specified directories in the pFileDirArray and returns the result
 * in an object.
 *
 * @param pFileDirArray   An array of (names of) files, directories and/ or glob patterns
 *                        to start the cruise with
 * @param pOptions        Options that influence the way the dependencies are cruised - and
 *                        how they are returned.
 * @param pResolveOptions Options that influence how dependency references are resolved to disk.
 *                        See https://webpack.js.org/configuration/resolve/ for the details.
 * @param pTSConfig       An object with with a typescript config object. Note that the
 *                        API will not take any 'extends' keys there into account, so
 *                        before calling make sure to flatten them out if you want them
 *                        used (the dependency-cruiser cli does this
 *                        [here](../src/cli/flattenTypeScriptConfig.js))
 */
export function cruise(
  pFileDirArray: ICruiseResult[],
  pOptions?: ICruiseOptions,
  pResolveOptions?: any,
  pTSConfig?: any
): IReporterOutput;

/**
 * Given a cruise result, formats it with the given reporter (pOutputType)
 *
 * @param pResult     A javascript object that contains the result of a cruise. Must adhere
 *                    to the [dependency-cruiser results schema](https://github.com/sverweij/dependency-cruiser/blob/develop/src/extract/results-schema.json)
 * @param pOutputType Which reporter to use to format the cruise result with
 */
export function format(pResult: any, pOutputType: OutputType): IReporterOutput;

/**
 * Returns an array of supported transpilers and for each of the transpilers
 * - the name of the transpiler
 * - the supported version range (semver version range)
 * - whether or not the transpiler is available in the current environment
 */
export function getAvailableTranspilers(): IAvailableTranspiler[];
