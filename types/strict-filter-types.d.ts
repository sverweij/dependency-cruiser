import {
  IDoNotFollowType,
  IExcludeType,
  IFocusType,
  IIncludeOnlyType,
} from "./filter-types";
import { DependencyType } from "./shared-types";

export interface IStrictDoNotFollowType extends IDoNotFollowType {
  /**
   * a regular expression for modules to include, but not follow further
   */
  path?: string;
  /**
   * an array of dependency types to include, but not follow further
   */
  dependencyTypes?: DependencyType[];
}

export interface IStrictExcludeType extends IExcludeType {
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

export interface IStrictIncludeOnlyType extends IIncludeOnlyType {
  /**
   * regular expression describing which dependencies the function
   * should cruise - anything not matching this will be skipped
   */
  path: string;
}

export interface IStrictFocusType extends IFocusType {
  /**
   * dependency-cruiser will include modules matching this regular expression
   * in its output, as well as their neighbours (direct dependencies and
   * dependents)
   */
  path: string;
}
