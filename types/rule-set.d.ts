import { SeverityType } from "./shared-types";
import {
  IBaseRestrictionType,
  IFromRestriction,
  IToRestriction,
  IReachabilityToRestrictionType,
  IRequiredToRestrictionType,
  IDependentsModuleRestrictionType,
} from "./restrictions";

interface IBaseRuleType {
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
}

export interface IRegularForbiddenRuleType extends IBaseRuleType {
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

export interface IReachabilityForbiddenRuleType extends IBaseRuleType {
  /**
   * Criteria the 'from' end of a dependency should match to be caught by this
   * rule. Leave it empty if you want any module to be matched.
   */
  from: IBaseRestrictionType;
  /**
   * Criteria the 'to' end of a dependency should match to be caught by this
   * rule. Leave it empty if you want any module to be matched.
   */
  to: IReachabilityToRestrictionType;
}

export interface IDependentsForbiddenRuleType extends IBaseRuleType {
  /**
   * Criteria to select the module(s) this restriction should apply to
   */
  module: IDependentsModuleRestrictionType;
  /**
   * Criteria at least one dependency of each matching module must
   * adhere to.
   */
  from: IBaseRestrictionType;
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
  from: IBaseRestrictionType;
  /**
   * Criteria the 'to' end of a dependency should match to be caught by this rule.
   * Leave it empty if you want any module to be matched.
   */
  to: IReachabilityToRestrictionType;
}

export type IForbiddenRuleType =
  | IRegularForbiddenRuleType
  | IReachabilityForbiddenRuleType
  | IDependentsForbiddenRuleType;

export interface IRequiredRuleType extends IBaseRuleType {
  /**
   * Criteria to select the module(s) this restriction should apply to
   */
  module: IBaseRestrictionType;
  /**
   * Criteria at least one dependency of each matching module must
   * adhere to.
   */
  to: IRequiredToRestrictionType;
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
  /**
   * A list of rules that describe what dependencies modules _must_ have.
   * E.g.
   * - every controller needs to (directly) depend on a base controller.
   * - each source file should be the dependency of a spec file with the same
   *   base name
   */
  required?: IRequiredRuleType[];
}
