import { DependencyType, SeverityType } from "./shared-types";

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
   * A regular expression to match against any 'exotic' require strings
   */
  exoticRequire?: string;
  /**
   * A regular expression to match against any 'exotic' require strings - when it should NOT be caught by the rule
   */
  exoticRequireNot?: string;
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

export interface IFlattenedRuleSet {
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
}
