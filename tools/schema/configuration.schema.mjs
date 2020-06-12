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
      description:
        "A configuration (or an array of configurations) this configuration uses as " +
        "a base",
      oneOf: [
        {
          type: "string",
        },
        {
          type: "array",
          items: {
            type: "string",
          },
        },
      ],
    },
  },
};
