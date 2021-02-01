import { IExcludeType, IFocusType, IIncludeOnlyType } from "./filter-types";

export interface IReporterOptions {
  /**
   * Options to tweak the output of the anonymous reporter
   */
  anon?: IAnonReporterOptions;
  /**
   * Options to tweak the output of the archi/ cdot reporter
   */
  archi?: IDotReporterOptions;
  /**
   * Options to tweak the output of the dot reporter
   */
  dot?: IDotReporterOptions;
  /**
   * Options to tweak the output of the ddot reporter
   */
  ddot?: IDotReporterOptions;
  /**
   * Options to tweak the output of the flat /fdot reporter
   */
  flat?: IDotReporterOptions;
}

export interface IReporterFiltersType {
  exclude: IExcludeType;
  includeOnly: IIncludeOnlyType;
  focus: IFocusType;
}

export interface IAnonReporterOptions {
  /**
   * List of words to use to replace path elements of file names in the output
   * with so the output isn't directly traceable to its intended purpose.
   * When the list is exhausted, the anon reporter will use random strings
   * patterned after the original file name in stead. The list is empty
   * by default.
   *
   * Read more in https://github.com/sverweij/dependency-cruiser/blob/develop/doc/cli.md#anon---obfuscated-json",
   */
  wordlist?: string[];
}

export interface IDotReporterOptions {
  /**
   * Regular expressions to collapse to. For the "dot" reporter defaults
   * to null, but "node_modules/[^/]+" is recommended for most use cases.
   */
  collapsePattern?: string | string[];
  /**
   * filters to apply to the reporter before rendering it (e.g. to leave
   * out details from the graphical output that are not relevant for the
   * goal of the report)
   */
  filters?: IReporterFiltersType;
  /**
   * A bunch of criteria to (conditionally) theme the dot output
   */
  theme?: IDotTheme;
}

export interface IDotTheme {
  /**
   * If passed with the value 'true', the passed theme replaces the default
   * one. In all other cases it extends the default theme
   */
  replace?: boolean;
  /**
   * Name- value pairs of GraphViz dot (global) attributes.
   */
  graph?: any;
  /**
   * Name- value pairs of GraphViz dot node attributes.
   */
  node?: any;
  /**
   * Name- value pairs of GraphViz dot edge attributes.
   */
  edge?: any;
  /**
   * List of criteria and attributes to apply for modules when the criteria are
   * met. Conditions can use any module attribute. Attributes can be any
   * that are valid in GraphViz dot nodes.
   */
  modules?: IDotThemeEntry[];
  /**
   * List of criteria and attributes to apply for dependencies when the criteria
   * are met. Conditions can use any dependency attribute. Attributes can be any
   * that are valid in GraphViz dot edges.
   */
  dependencies?: IDotThemeEntry[];
}

export interface IDotThemeEntry {
  criteria: any;
  attributes: any;
}
