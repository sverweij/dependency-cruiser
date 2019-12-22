const summary = require("./summary");
const modules = require("./modules");

module.exports = {
  $schema: "http://json-schema.org/draft-07/schema#",
  $id: "https://dependency-cruiser.js.org/cruise-result",
  title: "dependency-cruiser output format",
  type: "object",
  required: ["summary", "modules"],
  additionalProperties: false,
  properties: {
    modules: { $ref: "#/definitions/ModulesType" },
    summary: { $ref: "#/definitions/SummaryType" }
  },
  definitions: {
    ...modules.definitions,
    ...summary.definitions
  }
};
