module.exports = {
  definitions: {
    ReporterOptionsType: {
      type: "object",
      description: "Options to tweak the output of reporters",
      additionalProperties: false,
      properties: {
        anon: { $ref: "#/definitions/AnonReporterOptionsType" },
        dot: { $ref: "#/definitions/DotReporterOptionsType" }
      }
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
            "with so the output isn't directly traceable to its intended purpose." +
            "When the list is exhausted, the anon reporter will use random strings " +
            "patterned after the original file name in stead. The list is empty " +
            "by default. " +
            "Read more in https://github.com/sverweij/dependency-cruiser/blob/develop/doc/cli.md#anon---obfuscated-json",
          items: {
            type: "string"
          }
        }
      }
    },
    DotReporterOptionsType: {
      type: "object",
      description: "Options to tweak the output of the anonymous reporter",
      additionalProperties: false,
      properties: {
        theme: { $ref: "#/definitions/DotThemeType" }
      }
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
            "one. In all other cases it extends the default theme."
        },
        graph: {
          description: "Name- value pairs of GraphViz dot (global) attributes.",
          type: "object"
        },
        node: {
          description: "Name- value pairs of GraphViz dot node attributes.",
          type: "object"
        },
        edge: {
          description: "Name- value pairs of GraphViz dot edge attributes.",
          type: "object"
        },
        modules: {
          description:
            "List of criteria and attributes to apply for modules when the criteria are " +
            "met. Conditions can use any module attribute. Attributes can be any " +
            "that are valid in GraphViz dot nodes.",
          $ref: "#/definitions/DotThemeArrayType"
        },
        dependencies: {
          description:
            "List of criteria and attributes to apply for dependencies when the criteria are " +
            "met. Conditions can use any dependency attribute. Attributes can be any " +
            "that are valid in GraphViz dot edges.",
          $ref: "#/definitions/DotThemeArrayType"
        }
      }
    },
    DotThemeArrayType: {
      type: "array",
      items: { $ref: "#/definitions/DotThemeEntryType" }
    },
    DotThemeEntryType: {
      type: "object",
      additionalProperties: false,
      properties: {
        criteria: {
          type: "object"
        },
        attributes: {
          type: "object"
        }
      }
    }
  }
};
