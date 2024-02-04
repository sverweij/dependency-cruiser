import type { DependencyType } from "./shared-types.mjs";

export type MiniDependencyRestrictionType =
  | string
  | string[]
  | {
      /**
       * A regular expression or an array of regular expressions the
       * 'via' module should match to be caught by this rule.
       */
      path?: string | string[];
      /**
       * A regular expression or an array of regular expressions the
       * 'via' module should match to be caught by this rule.
       */
      pathNot?: string | string[];
      /**
       * Which dependency types the dependency between this via and the
       * previous one in the 'via chain' should have to be caught by
       * this rule
       */
      dependencyTypes?: DependencyType[];
      /**
       * Which dependency types the dependency between this via and the
       * previous one in the 'via chain' should _not_ have to be caught by
       * this rule
       */
      dependencyTypesNot?: DependencyType[];
    };

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
   * For circular dependencies - whether or not to match cycles that include
   * some modules with this regular expression. If you want to match cycles that
   * _exclusively_ include modules satisfying the regular expression use the viaOnly
   * restriction.
   * E.g. to allow all cycles
   * except when they go through one specific module. Typically to temporarily
   * disallow some cycles with a lower severity - setting up a rule with a via
   * that ignores them in an 'allowed' section.
   */
  via?: MiniDependencyRestrictionType;
  /**
   * "For circular dependencies - whether or not to match cycles that include
   * exclusively modules with this regular expression. This is different from
   * the regular via that already matches when only some of the modules in the
   * cycle satisfy the regular expression
   */
  viaOnly?: MiniDependencyRestrictionType;
  /**
   * For circular dependencies - whether or not to match cycles that include
   * _only_ modules that don't satisfy this regular expression. E.g. to disallow all cycles,
   * except when they go through one specific module. Typically to temporarily
   * allow some cycles until they're removed.
   * @deprecated use viaOnly.pathNot in stead
   */
  viaNot?: string | string[];
  /**
   * "For circular dependencies - whether or not to match cycles that include
   * _some_ modules that don't satisfy this regular expression.
   * @deprecated use via.pathNot in stead
   */
  viaSomeNot?: string | string[];
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
   * Whether or not to match modules NOT of any of these types (leaving out
   * matches none of them)"
   */
  dependencyTypesNot?: DependencyType[];
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
   * licenses. E.g. to flag everything non MIT use "MIT" here
   */
  licenseNot?: string | string[];
  /**
   * When set to true moreUnstable matches for any dependency that has a higher
   * Instability than the module that depends on it. When set to false it matches
   * when the opposite is true; the dependency has an equal or lower Instability.
   *
   * This attribute is useful when you want to check against Robert C. Martin's
   * stable dependency * principle. See online documentation for examples and
   * details.
   *
   * Leave this out when you don't care either way.
   */
  moreUnstable?: boolean;
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
   * E.g. to flag modules that are used only once or not at all, use 2 here.
   */
  numberOfDependentsLessThan?: number;
  /**
   * Matches when the number of times the 'to' module is used rises above (<)
   * this number. Caveat: only works in concert with path and pathNot restrictions
   * in the from and to parts of the rule; other conditions will be ignored.
   * E.g. to flag modules that are used more than 10 times, use 10 here.
   */
  numberOfDependentsMoreThan?: number;
}
