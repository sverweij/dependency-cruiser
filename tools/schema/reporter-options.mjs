import REAsStringsType from "./re-as-strings-type.mjs";
import compoundExcludeType from "./compound-exclude-type.mjs";
import compoundFocusType from "./compound-focus-type.mjs";
import compoundIncludeOnlyType from "./compound-include-only-type.mjs";
import compoundReachesType from "./compound-reaches-type.mjs";

export default {
  definitions: {
    ReporterOptionsType: {
      type: "object",
      description: "Options to tweak the output of reporters",
      additionalProperties: false,
      properties: {
        anon: { $ref: "#/definitions/AnonReporterOptionsType" },
        archi: { $ref: "#/definitions/DotReporterOptionsType" },
        dot: { $ref: "#/definitions/DotReporterOptionsType" },
        ddot: { $ref: "#/definitions/DotReporterOptionsType" },
        flat: { $ref: "#/definitions/DotReporterOptionsType" },
        markdown: { $ref: "#/definitions/MarkdownReporterOptionsType" },
        metrics: { $ref: "#/definitions/MetricsReporterOptionsType" },
        mermaid: { $ref: "#/definitions/MermaidReporterOptionsType" },
        text: { $ref: "#/definitions/TextReporterOptionsType" },
      },
    },
    AnonReporterOptionsType: {
      type: "object",
      description: "Options to tweak the output of the anonymous reporter",
      additionalProperties: false,
      properties: {
        wordlist: {
          type: "array",
          description:
            "List of words to use to replace path elements of file names in the output " +
            "with so the output isn't directly traceable to its intended purpose. " +
            "When the list is exhausted, the anon reporter will use random strings " +
            "patterned after the original file name in stead. The list is empty " +
            "by default. " +
            "Read more in https://github.com/sverweij/dependency-cruiser/blob/develop/doc/cli.md#anon---obfuscated-json",
          items: {
            type: "string",
          },
        },
      },
    },
    MetricsReporterOptionsType: {
      type: "object",
      description: "Options to tweak the output of the metrics reporter",
      additionalProperties: false,
      properties: {
        orderBy: {
          type: "string",
          enum: [
            "instability",
            "moduleCount",
            "afferentCouplings",
            "efferentCouplings",
            "name",
          ],
          description:
            "By what attribute (in addition to the names of the folders/ modules) " +
            "to order the metrics by. Defaults to 'instability'.",
        },
        hideModules: {
          type: "boolean",
          description:
            "When true hides module metrics from the report. Defaults to false",
        },
        hideFolders: {
          type: "boolean",
          description:
            "When true hides folder metrics from the report. Defaults to false",
        },
      },
    },
    MarkdownReporterOptionsType: {
      type: "object",
      description:
        "Options to show and hide sections of the markdown reporter and to provide " +
        "alternate boilerplate text",
      additionalProperties: false,
      properties: {
        showTitle: {
          type: "boolean",
          description:
            "Whether or not to show a title in the report. Defaults to true.",
        },
        title: {
          type: "string",
          description:
            "The text to show as a title of the report. E.g. " +
            "'## dependency-cruiser forbidden dependency check - results'. " +
            "When left out shows a default value.",
        },
        showSummary: {
          type: "boolean",
          description:
            "Whether or not to show a summary in the report. Defaults to true.",
        },
        showSummaryHeader: {
          type: "boolean",
          description:
            "Whether or not to give the summary a header. Defaults to true.",
        },
        summaryHeader: {
          type: "string",
          description:
            "The text to show as a header on top of the summary. E.g. '### Summary'. " +
            "When left out shows a default value.",
        },
        showStatsSummary: {
          type: "boolean",
          description:
            "Whether or not to show high level stats in the summary. Defaults to true.",
        },
        showRulesSummary: {
          type: "boolean",
          description:
            "Whether or not to show a list of violated rules in the summary. Defaults to true.",
        },
        includeIgnoredInSummary: {
          type: "boolean",
          description:
            "Whether or not to show rules in the list of rules for which all violations are ignored. Defaults to true.",
        },
        showDetails: {
          type: "boolean",
          description:
            "Whether or not to show a detailed list of violations. Defaults to true.",
        },
        includeIgnoredInDetails: {
          type: "boolean",
          description:
            "Whether or not to show ignored violations in the detailed list. Defaults to true.",
        },
        showDetailsHeader: {
          type: "boolean",
          description:
            "Whether or not to give the detailed list of violations a header. Defaults to true.",
        },
        detailsHeader: {
          type: "string",
          description:
            "The text to show as a header on top of the detailed list of violations. E.g. '### All violations'. " +
            "When left out shows a default value.",
        },
        collapseDetails: {
          type: "boolean",
          description:
            "Whether or not to collapse the list of violations in a <details> block. Defaults to true.",
        },
        collapsedMessage: {
          type: "string",
          description:
            "The text to in the <summary> section of the <details> block. E.g. 'click to see all violations'. " +
            "When left out shows a default value.",
        },
        noViolationsMessage: {
          type: "string",
          description:
            "The text to show when no violations were found. E.g. 'No violations found'. " +
            "When left out shows a default value.",
        },
        showFooter: {
          type: "boolean",
          description:
            "Whether or not to show a footer (with version & run date) at the bottom of the report. " +
            "Defaults to true",
        },
      },
    },
    MermaidReporterOptionsType: {
      type: "object",
      description: "Options to tweak the output of the mermaid reporters",
      additionalProperties: false,
      properties: {
        minify: {
          type: "boolean",
          description:
            "Whether or not to compresses the output text. Defaults to true.",
        },
      },
    },
    TextReporterOptionsType: {
      type: "object",
      description: "Options that influence rendition of the text reporter",
      additionalProperties: false,
      properties: {
        highlightFocused: {
          type: "boolean",
          description:
            "Whether or not to highlight modules that are focused with the --focus " +
            "command line option (/ general option). Defaults to false",
        },
      },
    },
    DotReporterOptionsType: {
      type: "object",
      description: "Options to tweak the output of the dot reporters",
      additionalProperties: false,
      properties: {
        collapsePattern: {
          description:
            'Regular expressions to collapse to. For the "dot" reporter defaults ' +
            'to null, but "node_modules/[^/]+" is recommended for most use cases.',
          $ref: "#/definitions/REAsStringsType",
        },
        filters: { $ref: "#/definitions/ReporterFiltersType" },
        showMetrics: {
          description:
            "When passed the value 'true', shows instability metrics in the " +
            "output if dependency-cruiser calculated them. Doesn't show them " +
            "in all other cases. Defaults to false",
          type: "boolean",
        },
        theme: { $ref: "#/definitions/DotThemeType" },
      },
    },
    DotThemeType: {
      type: "object",
      description: "A bunch of criteria to conditionally theme the dot output",
      additionalProperties: false,
      properties: {
        replace: {
          type: "boolean",
          description:
            "If passed with the value 'true', the passed theme replaces the default " +
            "one. In all other cases it extends the default theme.",
        },
        graph: {
          description: "Name- value pairs of GraphViz dot (global) attributes.",
          type: "object",
        },
        node: {
          description: "Name- value pairs of GraphViz dot node attributes.",
          type: "object",
        },
        edge: {
          description: "Name- value pairs of GraphViz dot edge attributes.",
          type: "object",
        },
        modules: {
          description:
            "List of criteria and attributes to apply for modules when the criteria are " +
            "met. Conditions can use any module attribute. Attributes can be any " +
            "that are valid in GraphViz dot nodes.",
          $ref: "#/definitions/DotThemeArrayType",
        },
        dependencies: {
          description:
            "List of criteria and attributes to apply for dependencies when the criteria are " +
            "met. Conditions can use any dependency attribute. Attributes can be any " +
            "that are valid in GraphViz dot edges.",
          $ref: "#/definitions/DotThemeArrayType",
        },
      },
    },
    DotThemeArrayType: {
      type: "array",
      items: { $ref: "#/definitions/DotThemeEntryType" },
    },
    DotThemeEntryType: {
      type: "object",
      additionalProperties: false,
      properties: {
        criteria: {
          type: "object",
        },
        attributes: {
          type: "object",
        },
      },
    },
    ReporterFiltersType: {
      type: "object",
      description:
        "filters to apply to the reporter before rendering it (e.g. to leave " +
        "out details from the graphical output that are not relevant for the " +
        "goal of the report)",
      additionalProperties: false,
      properties: {
        exclude: { $ref: "#/definitions/CompoundExcludeType" },
        includeOnly: { $ref: "#/definitions/CompoundIncludeOnlyType" },
        focus: { $ref: "#/definitions/CompoundFocusType" },
        reaches: { $ref: "#/definitions/CompoundReachesType" },
      },
    },
    ...compoundExcludeType.definitions,
    ...compoundIncludeOnlyType.definitions,
    ...compoundFocusType.definitions,
    ...compoundReachesType.definitions,
    ...REAsStringsType.definitions,
  },
};
