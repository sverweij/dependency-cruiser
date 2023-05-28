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
  /**
   * by default 'focus' only inlcudes the direct neighbours of the focus'ed module(s).
   * This property makes dependency-cruiser will also include neighbors of neighbors,
   * up to the specified depth.
   */
  depth?: number;
}

export interface IReachesType {
  /**
   * dependency-cruiser will include modules matching this regular expression
   * in its output, as well as _any_ module that reaches them - either directly
   * or via via. This matches against _resolved_ paths only
   * ('node_modules/chalk/source/index.js', 'src/utl/useful.ts as opposed to
   * the unresolved paths ('chalk', @aliased-utl/useful).
   *
   * If you want to use the _unresolved_ paths, use `pathUnresolved`.
   */
  path?: string | string[];
  /**
   * dependency-cruiser will include modules _equal_ to this (/ these) string(s)
   * in its output, as well as _any_ module that reaches them - either directly
   * or via via. This takes unresolved ('chalk', @aliased-utl/useful) paths.
   *
   * For _resolved_ paths use `path`
   */
  pathUnresolved?: string | string[];
}

export interface IHighlightType {
  /**
   * dependency-cruiser will mark modules matching this regular expression
   * as 'highlighted' in its output
   */
  path?: string | string[];
}
