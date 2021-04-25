import { ICruiseOptions } from "./options";
import { IFlattenedRuleSet } from "./rule-set";
import {
  DependencyType,
  ModuleSystemType,
  SeverityType,
  ProtocolType,
} from "./shared-types";

export interface ICruiseResult {
  /**
   * A list of modules, with for each module the modules it depends upon
   */
  modules: IModule[];
  /**
   * Data summarizing the found dependencies
   */
  summary: ISummary;
}

export interface IModule {
  /**
   * The (resolved) file name of the module, e.g. 'src/main/index.js'
   */
  source: string;
  /**
   * 'true' if this module violated a rule; 'false' in all other cases. The violated rule will
   * be in the 'rule' object at the same level.
   */
  valid: boolean;
  /**
   * list of modules this module depends on
   */
  dependencies: IDependency[];
  /**
   * list of modules that depend on this module (values are _resolved_ names of
   * those modules)
   */
  dependents: string[];
  /**
   * Whether or not this is a node.js core module
   */
  coreModule?: boolean;
  /**
   * 'true' if dependency-cruiser could not resolve the module name in the source code to a
   * file name or core module. 'false' in all other cases.
   */
  couldNotResolve?: boolean;
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
   * 'true' if the file name of this module matches the focus regular expression
   */
  matchesFocus?: boolean;
  /**
   * 'true' if this module does not have dependencies, and no module has it as a dependency
   */
  orphan?: boolean;
  /**
   * An array of objects that tell whether this module is 'reachable', and according to rule
   * in which this reachability was defined
   */
  reachable?: IReachable[];
  /**
   * An array of objects that tell which other modules it reaches,
   * and that falls within the definition of the passed rule.
   */
  reaches?: IReaches[];
  /**
   * an array of rules violated by this module - left out if the module is valid
   */
  rules?: IRuleSummary[];
  /**
   * true if the module was 'consolidated'. Consolidating implies the
   * entity a Module represents might be several modules at the same time.
   * This attribute is set by tools that consolidate modules for reporting
   * purposes - it will not be present after a regular cruise.
   */
  consolidated?: boolean;
}

export interface IDependency {
  /**
   * 'true' if following this dependency will ultimately return to the source, false in all
   * other cases
   */
  circular: boolean;
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
   * 'true' if the dependency between this dependency and its parent only
   * exists before compilation takes place. 'false in all other cases.
   * Dependency-cruiser will only specify this attribute for TypeScript and
   * then only when the option 'tsPreCompilationDeps' has the value 'specify'.
   */
  preCompilationOnly?: boolean;
  /**
   * If following this dependency will ultimately return to the source (circular === true),
   * this attribute will contain an (ordered) array of module names that shows (one of) the
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
   * true if the dependency was defined by a require not named 'require'
   * false in all other cases
   */
  exoticallyRequired: boolean;
  /**
   * If this dependency was defined by a require not named require (as defined in the
   * exoticRequireStrings option): the string that was used
   */
  exoticRequire?: string;
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
  module: string;
  /**
   * If the module specification is an URI with a protocol in it (e.g.
   * `import * as fs from 'node:fs'` or
   * `import stuff from 'data:application/json,some-thing'`) -
   * this attribute holds the protocol part (e.g. 'node:', 'data:', 'file:').
   *
   * Also see https://nodejs.org/api/esm.html#esm_urls
   */
  protocol: ProtocolType;
  /**
   * If the module specification is an URI and contains a mime type, this
   * attribute holds the mime type (e.g. in `import stuff from 'data:application/json,some-thing'
   * `this would be data:application/json)
   *
   * Also see https://nodejs.org/api/esm.html#esm_urls
   */
  mimeType: string;
  moduleSystem: ModuleSystemType;
  /**
   * The (resolved) file name of the module, e.g. 'src/main//index.js'
   */
  resolved: string;
  /**
   * an array of rules violated by this dependency - left out if the dependency is valid
   */
  rules?: IRuleSummary[];
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
export interface IRuleSummary {
  /**
   * The (short, eslint style) name of the violated rule. Typically something like
   * 'no-core-punycode' or 'no-outside-deps'.
   */
  name: string;
  /**
   * How severe a violation of a rule is. The 'error' severity will make some reporters return
   * a non-zero exit code, so if you want e.g. a build to stop when there's a rule violated:
   * use that. The absence of the 'ignore' severity here is by design; ignored rules don't
   * show up in the output.
   *
   * Severity to use when a dependency is not in the 'allowed' set of rules. Defaults to 'warn'
   */
  severity: SeverityType;
}

export interface IReachable {
  /**
   * The name of the rule where the reachability was defined
   */
  asDefinedInRule: string;
  /**
   * The matchedFrom attribute shows what the 'from' module that causes the 'reachable'
   * information to be what it is. Sometimes the 'asDefinedInRule' is not specific enough -
   * e.g. when the from part can be many modules and/ or contains capturing groups used
   * in the to part of the rule.
   */
  matchedFrom: string;
  /**
   * 'true' if this module is reachable from any of the modules matched by the from part of a
   * reachability-rule in 'asDefinedInRule', 'false' if not.
   */
  value: boolean;
}

export interface IReachesModule {
  /**
   * The (resolved) file name of the module, e.g. 'src/main/index.js'
   */
  source: string;
  /**
   * The path along wich the 'to' module is reachable from this one.
   */
  via: string[];
}

export interface IReaches {
  /**
   * The name of the rule where the reachability was defined
   */
  asDefinedInRule: string;
  /**
   * An array of modules that is (transitively) reachable from this module.
   */
  modules: IReachesModule[];
}

/**
 * Data summarizing the found dependencies
 */
export interface ISummary {
  /**
   * the number of errors in the dependencies
   */
  error: number;
  /**
   * the number of informational level notices in the dependencies
   */
  info: number;
  optionsUsed: IOptions;
  /**
   * rules used in the cruise
   */
  ruleSetUsed?: IFlattenedRuleSet;
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
  violations: IViolation[];
  /**
   * the number of warnings in the dependencies
   */
  warn: number;
}

/**
 * the (command line) options used to generate the dependency-tree
 */
export interface IOptions extends ICruiseOptions {
  /**
   * arguments passed on the command line
   */
  args?: string;
  /**
   * File the output was written to ('-' for stdout)
   */
  outputTo?: string;
  /**
   * The rules file used to validate the dependencies (if any)
   */
  rulesFile?: string;
  /**
   * The TypeScript configuration file used (if any)
   */
  tsConfig?: ITsConfig;
  /**
   * The webpack configuration options used for the cruise
   */
  webpackConfig?: IWebpackConfig;
  /**
   * The Babel configuration file used (if any)
   */
  babelConfig?: IBabelConfig;
}

export interface ITsConfig {
  fileName?: string;
}

export interface IBabelConfig {
  fileName?: string;
}

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

/**
 * The 'env' parameters passed
 */
export type WebpackEnvType = { [key: string]: any } | string;

export interface IViolation {
  /**
   * The violated rule
   */
  rule: IRuleSummary;
  /**
   * The from part of the dependency this violation is about
   */
  from: string;
  /**
   * The to part of the dependency this violation is about
   */
  to: string;
  /**
   * The circular path if the violation is about circularity
   */
  cycle?: string[];
  /**
   * The path from the from to the to if the violation is transitive
   */
  via?: string[];
}
