import type { ICruiseOptions } from "./options.mjs";
import type { IFlattenedRuleSet } from "./rule-set.mjs";
import type {
  IMiniDependency,
  DependencyType,
  ModuleSystemType,
  ProtocolType,
  ExperimentalStatsType,
} from "./shared-types.mjs";
import type { IViolation } from "./violations.mjs";
import type { IRuleSummary } from "./rule-summary.mjs";
import type { IChange } from "watskeburt";

export interface IRevisionChange extends IChange {
  // optional because
  // - in content strategy 'ignored' and 'deleted' files can't have a checksum
  // - in metadata strategy we don't calculate a checksum because ~we're lazy~
  //   it's an unnecessary expense
  checksum?: string;
}

/**
 * caching revisionData. doc and proper naming will follow
 */
export interface IRevisionData {
  /**
   * The version of the cache format. If the version number found in
   * the cache is < the version number in the code, the cache is
   * considered stale and won't be used (and overwritten on next run).
   */
  cacheFormatVersion?: number;
  SHA1: string;
  changes: IRevisionChange[];
}

export interface ICruiseResult {
  /**
   * A list of modules, with for each module the modules it depends upon
   */
  modules: IModule[];
  /**
   * A list of folders, as derived from the detected modules, with for each
   * folder a bunch of metrics (adapted from 'Agile software development:
   * principles, patterns, and practices' by Robert C Martin (ISBN 0-13-597444-5).
   * Note: these metrics substitute 'components' and 'classes' from that book
   * with 'folders' and 'modules'; the closest relatives that work for the most
   * programming styles in JavaScript (and its derivative languages).
   */
  folders?: IFolder[];
  /**
   * Data summarizing the found dependencies
   */
  summary: ISummary;
  /**
   * caching revisionData. doc and proper naming will follow
   */
  revisionData?: IRevisionData;
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
   * we didn't bother determining it) or one of the npm dependencies defined in a package.json
   * ('npm' for 'dependencies', 'npm-dev', 'npm-optional', 'npm-peer', 'npm-no-pkg' for
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
   * 'true' if the file name of this module matches the 'doNotFollow' regular expression
   */
  matchesDoNotFollow?: boolean;
  /**
   * 'true' if the file name of this module matches the 'focus' filter regular expression
   */
  matchesFocus?: boolean;
  /**
   * 'true' if the file name of this module matches the 'reaches' filter regular expression
   */
  matchesReaches?: boolean;
  /**
   * 'true' if the file name of this module matches the 'highlight' regular expression
   */
  matchesHighlight?: boolean;
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
  /**
   * "number of dependents/ (number of dependents + number of dependencies)
   * A measure for how stable the module is; ranging between 0 (completely
   * stable module) to 1 (completely instable module). Derived from Uncle
   * Bob's instability metric - but applied to a single module instead of
   * to a group of them. This attribute is only present when dependency-cruiser
   * was asked to calculate metrics.
   */
  instability?: number;
  /**
   * a collection of stats that are not part of the regular output, but
   * might be interesting for further analysis
   */
  experimentalStats?: ExperimentalStatsType;
  /**
   * checksum of the contents of the module. This attribute is currently only
   * available when the cruise was executed with caching and the cache strategy
   * is 'content'.
   */
  checksum?: string;
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
   * 'true' if dependency-cruiser could not resolve the module name in the source code to a
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
   * 'true' when the module included the module explicitly as type only with the
   * `type` keyword e.g. `import type { IThingus } from 'thing'`. Dependency-cruiser
   * will only specify this attribute for TypeScript and when the 'tsPreCompilationDeps'
   * option has either the value `true` or `"specify"`.
   */
  typeOnly?: boolean;
  /**
   * If following this dependency will ultimately return to the source (circular === true),
   * this attribute will contain an (ordered) array of module names that shows (one of) the
   * circular path(s)
   */
  cycle?: IMiniDependency[];
  /**
   * the type of inclusion - local, core, unknown (= we honestly don't know), undetermined (=
   * we didn't bother determining it) or one of the npm dependencies defined in a package.json
   * ('npm' for 'dependencies', 'npm-dev', 'npm-optional', 'npm-peer', 'npm-no-pkg' for
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
  /**
   * the (de-normalized) instability of the dependency - also available in
   * the module on the 'to' side of this dependency
   */
  instability: number;
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
   * The path along which the 'to' module is reachable from this one.
   */
  via: IMiniDependency[];
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
   * the number of ignored notices in the dependencies
   */
  ignore: number;
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
}

export interface IFolderDependency {
  /**
   * the (resolved) name of the dependency
   */
  name: string;
  /**
   * 'true' if this folder dependency violated a rule; 'false' in all other
   * cases. The violated rule will be in the 'rules' object at the same level.
   */
  valid: boolean;
  /**
   * the instability of the dependency (de-normalized - this is a duplicate of
   * the one found in the instability of the folder with the same name)
   */
  instability?: number;
  /**
   * 'true' if following this dependency will ultimately return to the source, false in all
   * other cases
   */
  circular: boolean;
  /**
   * If following this dependency will ultimately return to the source (circular === true),
   * this attribute will contain an (ordered) array of module names that shows (one of) the
   * circular path(s)
   */
  cycle?: IMiniDependency[];
  /**
   * an array of rules violated by this dependency - left out if the dependency
   * is valid
   */
  rules?: IRuleSummary[];
}

export interface IFolderDependent {
  /**
   * name ('path') of the dependent
   */
  name: string;
}

export interface IFolder {
  /**
   * The name of the folder. FOlder names are normalized to posix (so
   * separated by forward slashes e.g.: src/things/morethings)
   */
  name: string;
  /**
   * List of folders depending on this folder
   */
  dependents?: IFolderDependent[];
  /**
   * List of folders this folder depends upon
   */
  dependencies?: IFolderDependency[];
  /**
   * The total number of modules detected in this folder and its sub-folders
   */
  moduleCount: number;
  /**
   * The number of modules outside this folder that depend on modules
   * within this folder. Only present when dependency-cruiser was
   * "asked to calculate it.
   */
  afferentCouplings?: number;
  /**
   * The number of modules inside this folder that depend on modules
   * outside this folder. Only present when dependency-cruiser was
   * asked to calculate it.
   */
  efferentCouplings?: number;
  /**
   * efferentCouplings/ (afferentCouplings + efferentCouplings)
   *
   * A measure for how stable the folder is; ranging between 0
   * (completely stable folder) to 1 (completely instable folder)
   * Note that while 'instability' has a negative connotation it's also
   * (unavoidable in any meaningful system. It's the basis of Martin's
   * variable component stability principle: 'the instability of a folder
   * should be larger than the folders it depends on'. Only present when
   * dependency-cruiser was asked to calculate it.,
   */
  instability?: number;
  /**
   * a collection of stats that are not part of the regular output, but
   * might be interesting for further analysis
   */
  experimentalStats?: ExperimentalStatsType;
}

export type * from "./violations.mjs";
export type * from "./rule-summary.mjs";
