import ruleSummary from "./rule-summary.mjs";

export default {
  definitions: {
    FoldersType: {
      type: "array",
      description:
        "A list of folders, as derived from the detected modules, with for each " +
        "folder a bunch of metrics (adapted from 'Agile software development: " +
        "principles, patterns, and practices' by Robert C Martin (ISBN 0-13-597444-5). " +
        "Note: these metrics substitute 'components' and 'classes' from that book " +
        "with 'folders' and 'modules'; the closest relatives that work for the most " +
        "programming styles in JavaScript (and its derivative languages).",
      items: { $ref: "#/definitions/FolderType" },
    },
    FolderType: {
      type: "object",
      required: ["name", "moduleCount"],
      additionalProperties: false,
      properties: {
        name: {
          type: "string",
          description:
            "The name of the folder. Folder names are normalized to posix (so " +
            "separated by forward slashes e.g.: src/things/morethings)",
        },
        dependents: {
          type: "array",
          description: "list of folders depending on this folder",
          items: {
            type: "object",
            required: ["name"],
            additionalProperties: false,
            properties: {
              name: {
                type: "string",
                description: "the (resolved) name of the dependent",
              },
            },
          },
        },
        dependencies: {
          type: "array",
          description: "list of folders this module depends upon",
          items: {
            type: "object",
            required: ["name", "valid", "circular"],
            additionalProperties: false,
            properties: {
              name: {
                type: "string",
                description: "the (resolved) name of the dependency",
              },
              instability: {
                type: "number",
                description:
                  "the instability of the dependency (de-normalized - this is " +
                  "a duplicate of the one found in the instability of the " +
                  "folder with the same name)",
              },
              valid: {
                type: "boolean",
                description:
                  "'true' if this folder dependency violated a rule; 'false' in " +
                  "all other cases. " +
                  "The violated rule will be in the 'rules' object at the same level.",
              },
              circular: {
                type: "boolean",
                description:
                  "'true' if following this dependency will ultimately return to the " +
                  "source, false in all other cases",
              },
              cycle: {
                type: "array",
                items: { type: "string" },
                description:
                  "If following this dependency will ultimately return to the source " +
                  "(circular === true), this attribute will contain an (ordered) array " +
                  "of module names that shows (one of) the circular path(s)",
              },
              rules: {
                type: "array",
                items: { $ref: "#/definitions/RuleSummaryType" },
                description:
                  "an array of rules violated by this dependency - left out if the dependency " +
                  "is valid",
              },
            },
          },
        },
        moduleCount: {
          type: "number",
          description:
            "The total number of modules detected in this folder and its sub-folders",
        },
        afferentCouplings: {
          type: "number",
          description:
            "The number of modules outside this folder that depend on modules " +
            "within this folder. Only present when dependency-cruiser was " +
            "asked to calculate it.",
        },
        efferentCouplings: {
          type: "number",
          description:
            "The number of modules inside this folder that depend on modules " +
            "outside this folder. Only present when dependency-cruiser was " +
            "asked to calculate it.",
        },
        instability: {
          type: "number",
          description:
            "efferentCouplings/ (afferentCouplings + efferentCouplings) " +
            "A measure for how stable the folder is; ranging between 0 " +
            "(completely stable folder) to 1 (completely instable folder) " +
            "Note that while 'instability' has a negative connotation it's also " +
            "unavoidable in any meaningful system. It's the basis of Martin's " +
            "variable component stability principle: 'the instability of a folder " +
            "should be larger than the folders it depends on'. Only present when " +
            "dependency-cruiser was asked to calculate it.",
        },
      },
    },
    ...ruleSummary.definitions,
  },
};
