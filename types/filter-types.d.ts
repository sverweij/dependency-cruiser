import { DependencyType } from "./shared-types";

export interface IDoNotFollowType {
  /**
   * a regular expression for modules to include, but not follow further
   */
  path?: string | string[];
  /**
   * an array of dependency types to include, but not follow further
   */
  dependencyTypes?: DependencyType[];
}

export interface IExcludeType {
  /**
   * a regular expression for modules to exclude
   */
  path?: string | string[];
  /**
   * a boolean indicating whether or not to exclude dynamic dependencies
   * leave out to match both
   */
  dynamic?: boolean;
}

export interface IIncludeOnlyType {
  /**
   * regular expression describing which dependencies the function
   * should cruise - anything not matching this will be skipped
   */
  path?: string | string[];
}

export interface IFocusType {
  /**
   * dependency-cruiser will include modules matching this regular expression
   * in its output, as well as their neighbours (direct dependencies and
   * dependents)
   */
  path?: string | string[];
}
