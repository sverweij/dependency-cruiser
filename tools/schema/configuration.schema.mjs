import options from "./options.mjs";
import ruleSet from "./rule-set.mjs";

export default {
  title: "dependency-cruiser configuration",
  $schema: "http://json-schema.org/draft-07/schema#",
  $id: "https://dependency-cruiser.js.org/schema/configuration.schema.json",
  description:
    "A set of properties describing what dependencies are forbidden and what dependencies are " +
    "allowed + options on how to cruise through the code",
  type: "object",
  additionalProperties: false,
  properties: {
    ...ruleSet.properties,
    options: { $ref: "#/definitions/OptionsType" },
    extends: { $ref: "#/definitions/ExtendsType" },
  },
  definitions: {
    ...ruleSet.definitions,
    ...options.definitions,
    ExtendsType: {
      description: "A configuration this configuration uses as a base",
      oneOf: [
        {
          type: "string",
        },
        {
          type: "array",
          description:
            "A list of rules that describe dependencies that are allowed. dependency-cruiser will " +
            "emit the warning message 'not-in-allowed' for each dependency that does not at least " +
            "meet one of them.",
          items: {
            type: "string",
          },
        },
      ],
    },
  },
};
