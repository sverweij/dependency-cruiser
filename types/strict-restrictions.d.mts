import type {
  IBaseRestrictionType,
  IFromRestriction,
  IToRestriction,
  IReachabilityToRestrictionType,
  IRequiredToRestrictionType,
  IDependentsModuleRestrictionType,
} from "./restrictions.mjs";
import type { DependencyType } from "./shared-types.mjs";

export interface IStrictMiniDependencyRestriction {
  path?: string;
  dependencyType?: DependencyType[];
}

export interface IStrictBaseRestrictionType extends IBaseRestrictionType {
  path?: string;
  pathNot?: string;
}

export interface IStrictFromRestriction extends IFromRestriction {
  path?: string;
  pathNot?: string;
}

interface IStrictToRestriction extends IToRestriction {
  path?: string;
  pathNot?: string;
  via?: IStrictMiniDependencyRestriction;
  viaNot?: IStrictMiniDependencyRestriction;
  viaOnly?: IStrictMiniDependencyRestriction;
  viaSomeNot?: IStrictMiniDependencyRestriction;
  exoticRequire?: string;
  exoticRequireNot?: string;
  license?: string;
  licenseNot?: string;
}

export interface IStrictReachabilityToRestrictionType
  extends IReachabilityToRestrictionType {
  path?: string;
  pathNot?: string;
}

export interface IStrictRequiredToRestrictionType
  extends IRequiredToRestrictionType {
  path?: string;
}

export interface IStrictDependentsModuleRestrictionType
  extends IDependentsModuleRestrictionType {
  path?: string;
  pathNot?: string;
}
