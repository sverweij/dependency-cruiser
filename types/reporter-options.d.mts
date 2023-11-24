import type {
  IExcludeType,
  IFocusType,
  IIncludeOnlyType,
  IReachesType,
} from "./filter-types.mjs";

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
  /**
   * Options to tweak the output of the metrics reporter
   */
  metrics?: IMetricsReporterOptions;
  /**
   * Options to show and hide sections of the markdown reporter and to provide
   * alternate boilerplate text.
   */
  markdown?: IMarkdownReporterOptions;
  /**
   * Options that influence rendition of the mermaid reporter
   */
  mermaid?: IMermaidReporterOptions;
  /**
   * Options that influence rendition of the text reporter
   */
  text?: ITextReporterOptions;
}

export interface IReporterFiltersType {
  exclude: IExcludeType;
  includeOnly: IIncludeOnlyType;
  focus: IFocusType;
  reaches: IReachesType;
}

export interface IAnonReporterOptions {
  /**
   * List of words to use to replace path elements of file names in the output
   * with so the output isn't directly traceable to its intended purpose.
   * When the list is exhausted, the anon reporter will use random strings
   * patterned after the original file name in stead. The list is empty
   * by default.
   *
   * Read more in https://github.com/sverweij/dependency-cruiser/blob/main/doc/cli.md#anon---obfuscated-json",
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
   * When passed the value 'true', shows instability metrics in the
   * output if dependency-cruiser calculated them. Doesn't show them
   * in all other cases. Defaults to false",
   */
  showMetrics?: boolean;
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

export interface IMetricsReporterOptions {
  hideModules?: boolean;
  hideFolders?: boolean;
  oderBy?: MetricsOrderByType;
}

export interface IMarkdownReporterOptions {
  /**
   * Whether or not to show a title in the report. Defaults to true.
   */
  showTitle?: boolean;
  /**
   * The text to show as a title of the report. E.g.
   * '## dependency-cruiser forbidden dependency check - results'.
   * When left out shows a default value.
   */
  title?: string;
  /**
   * Whether or not to show a summary in the report. Defaults to true.
   */
  showSummary?: boolean;
  /**
   * Whether or not to give the summary a header. Defaults to true.
   */
  showSummaryHeader?: boolean;
  /**
   * The text to show as a header on top of the summary. E.g. '### Summary'"
   * When left out shows a default value.
   */
  summaryHeader?: string;
  /**
   * Whether or not to show high level stats in the summary. Defaults to true.
   */
  showStatsSummary?: boolean;
  /**
   * Whether or not to show a list of violated rules in the summary. Defaults to true.
   */
  showRulesSummary?: boolean;
  /**
   * Whether or not to show rules in the list of rules for which all violations are ignored.
   * Defaults to true.
   */
  includeIgnoredInSummary?: boolean;
  /**
   * Whether or not to show a detailed list of violations. Defaults to true.
   */
  showDetails?: boolean;
  /**
   * Whether or not to show ignored violations in the detailed list. Defaults to true.
   */
  includeIgnoredInDetails?: boolean;
  /**
   * Whether or not to give the detailed list of violations a header. Defaults to true.
   */
  showDetailsHeader?: boolean;
  /**
   * The text to show as a header on top of the detailed list of violations. E.g. '### All violations'
   * When left out shows a default value.
   */
  detailsHeader?: boolean;
  /**
   * Whether or not to collapse the list of violations in a <details> block. Defaults to true.
   */
  collapseDetails?: boolean;
  /**
   * The text to in the <summary> section of the <details> block. E.g. 'click to see all violations'
   * When left out shows a default value.
   */
  collapsedMessage?: string;
  /**
   * The text to show when no violations were found. E.g. 'No violations found'.
   * When left out shows a default value.
   */
  noViolationsMessage?: string;
  /**
   * Whether or not to show a footer (with version & run date) at the bottom of the report.
   * Defaults to true
   */
  showFooter?: boolean;
}

export interface IMermaidReporterOptions {
  /**
   * Whether or not to compresses the output text. Defaults to true.
   */
  minify?: boolean;
}

export interface ITextReporterOptions {
  /**
   * Whether or not to highlight modules that are focused with the --focus
   * command line option (/ general option). Defaults to false
   */
  highlightFocused?: boolean;
}

export type MetricsOrderByType =
  | "instability"
  | "moduleCount"
  | "afferentCouplings"
  | "efferentCouplings"
  | "name";
