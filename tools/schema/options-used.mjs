import compoundDoNotFollowType from "./compound-donot-follow-type.mjs";
import compoundExcludeType from "./compound-exclude-type.mjs";
import compoundFocusType from "./compound-focus-type.mjs";
import compoundReachesType from "./compound-reaches-type.mjs";
import compoundHighlightType from "./compound-highlight-type.mjs";
import compoundIncludeOnlyType from "./compound-include-only-type.mjs";
import dependencyType from "./dependency-type.mjs";
import moduleSystemsType from "./module-systems-type.mjs";
import options from "./options.mjs";
import outputType from "./output-type.mjs";
import reporterOptions from "./reporter-options.mjs";
import cacheOptions from "./cache-options.mjs";

export default {
  definitions: {
    OptionsUsedType: {
      type: "object",
      description:
        "the (command line) options used to generate the dependency-tree",
      additionalProperties: false,
      properties: {
        ...options.definitions.OptionsType.properties,
        // does not occur in the input schema
        args: {
          type: "string",
          description: "arguments passed on the command line",
        },
        // does not occur in the input schema
        rulesFile: {
          type: "string",
          description:
            "The rules file used to validate the dependencies (if any)",
        },
        // does not occur in the input schema
        outputTo: {
          type: "string",
          description: "File the output was written to ('-' for stdout)",
        },
        // does not occur in the input schema
        outputType: { $ref: "#/definitions/OutputType" },
        // doNotFollow can be either a string or an object in the input options -
        // in the output it's always an object
        doNotFollow: {
          $ref: "#/definitions/CompoundDoNotFollowType",
        },
        // exclude can be either a string or an object in the input options -
        // in the output it's always an object
        exclude: { $ref: "#/definitions/CompoundExcludeType" },
        // includeOnly can be either a string or an object in the input options -
        // in the output it can be too for backwards compatibility reasons.
        // This is different from the other filter options, and it will
        // be aligned to the other filter options in the next major version
        /* includeOnly: { $ref: "#/definitions/CompoundIncludeOnlyType" }, */
        // focus, reaches and highlight can be either a string or an object in
        // the input options - in the output it's always an object
        focus: { $ref: "#/definitions/CompoundFocusType" },
        reaches: { $ref: "#/definitions/CompoundReachesType" },
        highlight: { $ref: "#/definitions/CompoundHighlightType" },
        // can be input as either a digit or a string, but for internal processing
        // and output always translated to a string containing a regex
        collapse: {
          type: "string",
        },
        // for backwards compatibility reasons can be either a string, false
        // or an object in the input, but for internal processing and output
        // always put as an object
        cache: {
          oneOf: [
            {
              type: "boolean",
              enum: [false],
            },
            { $ref: "#/definitions/CacheOptionsType" },
          ],
        },
      },
    },
    ...moduleSystemsType.definitions,
    ...dependencyType.definitions,
    ...outputType.definitions,
    ...compoundExcludeType.definitions,
    ...compoundDoNotFollowType.definitions,
    ...compoundIncludeOnlyType.definitions,
    ...compoundFocusType.definitions,
    ...compoundReachesType.definitions,
    ...compoundHighlightType.definitions,
    ...reporterOptions.definitions,
    ...cacheOptions.definitions,
  },
};
