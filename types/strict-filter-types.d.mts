import type {
  IDoNotFollowType,
  IExcludeType,
  IFocusType,
  IIncludeOnlyType,
  IReachesType,
  IHighlightType,
} from "./filter-types.mjs";
import type { DependencyType } from "./shared-types.mjs";

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
  /**
   * by default 'focus' only includes the direct neighbours of the focus'ed module(s).
   * This property makes dependency-cruiser will also include neighbors of neighbors,
   * up to the specified depth.
   */
  depth?: number;
}

export interface IStrictReachesType extends IReachesType {
  /**
   * dependency-cruiser will include modules matching this regular expression
   * in its output, as well as _any_ module that reaches them - either directly
   * or via via.
   */
  path: string;
}

export interface IStrictHighlightType extends IHighlightType {
  /**
   * dependency-cruiser will include modules matching this regular expression
   * in its output, as well as _any_ module that reaches them - either directly
   * or via via.
   */
  path: string;
}
