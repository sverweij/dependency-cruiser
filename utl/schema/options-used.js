const options = require("./options");
const dependencyType = require("./dependency-type");
const moduleSystemsType = require("./module-systems-type");
const outputType = require("./output-type");
const compoundExcludeType = require("./compound-exclude-type");
const compoundDoNotFollowType = require("./compound-donot-follow-type");

module.exports = {
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
          description: "arguments passed on the command line"
        },
        // does not occur in the input schema
        rulesFile: {
          type: "string",
          description:
            "The rules file used to validate the dependencies (if any)"
        },
        // does not occur in the input schema
        outputTo: {
          type: "string",
          description: "File the output was written to ('-' for stdout)"
        },
        // does not occur in the input schema
        outputType: { $ref: "#/definitions/OutputType" },
        // doNotFollow can be either a string or an object in the input options -
        // in the output it's always an object
        doNotFollow: {
          $ref: "#/definitions/CompoundDoNotFollowType"
        },
        // exclude can be either a string or an object in the input options -
        // in the output it's always an object
        exclude: { $ref: "#/definitions/CompoundExcludeType" }
      }
    },
    ...moduleSystemsType.definitions,
    ...dependencyType.definitions,
    ...outputType.definitions,
    ...compoundExcludeType.definitions,
    ...compoundDoNotFollowType.definitions
  }
};
