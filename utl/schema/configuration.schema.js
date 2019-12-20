const ruleSet = require("./rule-set.schema-snippet");
const options = require("./options.schema-snippet");

module.exports = {
  $schema: "http://json-schema.org/draft-07/schema#",
  $id: "https://dependency-cruiser.js.org/config-schema",
  title: "dependency-cruiser configuration",
  description:
    "A set of properties describing what dependencies are forbidden and what dependencies are allowed + options on how to cruise through the code",
  type: "object",
  additionalProperties: false,
  properties: {
    extends: {
      description: "A configuration this configuration uses as a base",
      oneOf: [
        {
          type: "string"
        },
        {
          type: "array",
          description:
            "A list of rules that describe dependencies that are allowed. dependency-cruiser will emit the warning message 'not-in-allowed' for each dependency that does not at least meet one of them.",
          items: {
            type: "string"
          }
        }
      ]
    },
    ...ruleSet.properties,
    options: { ...options.options }
  },
  definitions: {
    ...ruleSet.definitions,
    ...options.definitions
  }
};
