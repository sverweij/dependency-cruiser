const options = require("./options");
const dependencyType = require("./dependency-type");
const moduleSystemsType = require("./module-systems-type");
const outputType = require("./output-type");

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
        outputType: { $ref: "#/definitions/OutputType" },
        // doNotFollow can be either a string or an object in the input options -
        // in the output it's always an object
        doNotFollow: {
          type: "object",
          description:
            "Criteria for modules to include, but not to follow further",
          additionalProperties: false,
          properties: {
            path: {
              type: "string",
              description:
                "a regular expression for modules to include, but not follow further"
            },
            dependencyTypes: {
              type: "array",
              description:
                "an array of dependency types to include, but not follow further",
              items: { $ref: "#/definitions/DependencyTypeType" }
            }
          }
        },
        // exclude can be either a string or an object in the input options -
        // in the output it's always an object
        exclude: {
          type: "object",
          description: "Criteria for dependencies to exclude",
          additionalProperties: false,
          properties: {
            path: {
              type: "string",
              description:
                "a regular expression for modules to exclude from being cruised"
            },
            dynamic: {
              type: "boolean",
              description:
                "a boolean indicating whether or not to exclude dynamic dependencies"
            }
          }
        },
        // tsConfig can be either a string or an object in the input options -
        // in the output it's always an object
        tsConfig: {
          type: "object",
          additionalProperties: false,
          properties: {
            fileName: {
              type: "string"
            }
          }
        }
      }
    },
    ...moduleSystemsType.definitions,
    ...dependencyType.definitions,
    ...outputType.definitions
  }
};
