import { DependencyType } from "./shared-types";

export interface IBaseRestrictionType {
  /**
   * A regular expression or an array of regular expressions that select
   * the modules this required rule should apply to.
   */
  path?: string | string[];
  /**
   * A regular expression or an array of regular expressions that select
   * the modules this required rule should not apply to (you can use this
   * to make exceptions on the `path` attribute)
   */
  pathNot?: string | string[];
}

export interface IFromRestriction extends IBaseRestrictionType {
  /**
   * Whether or not to match when the module is an orphan (= has no incoming and no outgoing
   * dependencies). When this property it is part of a rule, dependency-cruiser will
   * ignore the 'to' part.
   */
  orphan?: boolean;
}

export interface IToRestriction extends IBaseRestrictionType {
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
   * Whether or not to match when the dependency is exotically required
   */
  exoticallyRequired?: boolean;
  /**
   * A regular expression to match against any 'exotic' require strings
   */
  exoticRequire?: string | string[];
  /**
   * A regular expression to match against any 'exotic' require strings - when it should NOT be caught by the rule
   */
  exoticRequireNot?: string | string[];
  /**
   * true if this dependency only exists before compilation (like type only imports),
   * false in all other cases. Only returned when the tsPreCompilationDeps is set to 'specify'.
   */
  preCompilationOnly?: boolean;
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
  license?: string | string[];
  /**
   * Whether or not to match modules that were NOT released under one of the mentioned
   * licenses. E.g. to flag everyting non MIT use "MIT" here
   */
  licenseNot?: string | string[];
}

export interface IReachabilityToRestrictionType extends IBaseRestrictionType {
  /**
   * Whether or not to match modules that aren't reachable from the from part of the rule.
   */
  reachable: boolean;
}

export interface IRequiredToRestrictionType {
  /**
   * A regular expression or an array of regular expressions at least
   * one of the dependencies of the module should adhere to.
   */
  path?: string | string[];
}

export interface IDependentsModuleRestrictionType extends IBaseRestrictionType {
  /**
   * Matches when the number of times the 'to' module is used falls below (<)
   * this number. Caveat: only works in concert with path and pathNot restrictions
   * in the from and to parts of the rule; other conditions will be ignored.
   * (somewhat experimental; - syntax can change over time without a major bump)
   * E.g. to flag modules that are used only once or not at all, use 2 here.
   */
  numberOfDependentsLessThan?: number;
  /**
   * Matches when the number of times the 'to' module is used rises above (<)
   * this number. Caveat: only works in concert with path and pathNot restrictions
   * in the from and to parts of the rule; other conditions will be ignored.
   * (somewhat experimental; - syntax can change over time without a major bump)
   * E.g. to flag modules that are used more than 10 times, use 10 here.
   */
  numberOfDependentsMoreThan?: number;
}
