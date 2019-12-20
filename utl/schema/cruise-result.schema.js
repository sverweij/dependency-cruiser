const summary = require("./summary.schema-snippet");
const modules = require("./modules.schema-snippet");

module.exports = {
  $schema: "http://json-schema.org/draft-07/schema#",
  $id: "https://dependency-cruiser.js.org/results-schema",
  title: "dependency-cruiser output format",
  type: "object",
  required: ["summary", "modules"],
  additionalProperties: false,
  properties: {
    summary: { $ref: "#/definitions/SummaryType" },
    modules: { $ref: "#/definitions/ModulesType" }
  },
  definitions: {
    ...summary.definitions,
    ...modules.definitions
  }
};
