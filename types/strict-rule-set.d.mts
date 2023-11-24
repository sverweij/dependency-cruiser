import type { SeverityType, RuleScopeType } from "./shared-types.mjs";
import type {
  IBaseRuleType,
  IRegularAllowedRuleType,
  IFlattenedRuleSet,
} from "./rule-set.mjs";
import type {
  IStrictToRestriction,
  IStrictFromRestriction,
  IStrictBaseRestrictionType,
  IStrictReachabilityToRestrictionType,
  IStrictDependentsModuleRestrictionType,
  IStrictRequiredToRestrictionType,
} from "./strict-restrictions.mjs";

export interface IStrictBaseRuleType extends IBaseRuleType {
  name: string;
  severity: SeverityType;
}

export interface IStrictRegularForbiddenRuleType extends IStrictBaseRuleType {
  from: IStrictFromRestriction;
  to: IStrictToRestriction;
  scope: RuleScopeType;
}

export interface IStrictReachabilityForbiddenRuleType
  extends IStrictBaseRuleType {
  from: IStrictBaseRestrictionType;
  to: IStrictReachabilityToRestrictionType;
}

export interface IStrictDependentsForbiddenRuleType
  extends IStrictBaseRuleType {
  module: IStrictDependentsModuleRestrictionType;
  from: IStrictBaseRestrictionType;
}

export interface IStrictReachabilityAllowedRuleType {
  from: IStrictBaseRestrictionType;
  to: IStrictReachabilityToRestrictionType;
}

export type IStrictForbiddenRuleType =
  | IStrictRegularForbiddenRuleType
  | IStrictReachabilityForbiddenRuleType
  | IStrictDependentsForbiddenRuleType;

export interface IStrictRequiredRuleType extends IStrictBaseRuleType {
  module: IStrictBaseRestrictionType;
  to: IStrictRequiredToRestrictionType;
}

export interface IStrictRegularAllowedRuleType extends IRegularAllowedRuleType {
  from: IStrictFromRestriction;
  to: IStrictToRestriction;
}
export type IStrictAllowedRuleType =
  | IStrictRegularAllowedRuleType
  | IStrictReachabilityAllowedRuleType;

export type IStrictAnyRuleType =
  | IStrictForbiddenRuleType
  | IStrictAllowedRuleType
  | IStrictRequiredRuleType;

export interface IStrictRuleSet extends IFlattenedRuleSet {
  forbidden?: IStrictForbiddenRuleType[];
  allowed?: IStrictAllowedRuleType[];
  allowedSeverity?: SeverityType;
  required?: IStrictRequiredRuleType[];
}
