const sharedTypes = require("./shared-types.schema-snippet");

module.exports = {
  definitions: {
    ...sharedTypes,
    RuleSummaryType: {
      type: "object",
      description:
        "If there was a rule violation (valid === false), this object contains the name of the rule and severity of violating it.",
      required: ["name", "severity"],
      additionalProperties: false,
      properties: {
        name: {
          type: "string",
          description:
            "The (short, eslint style) name of the violated rule. Typically something like 'no-core-punycode' or 'no-outside-deps'."
        },
        severity: { $ref: "#/definitions/SeverityType" }
      }
    }
  }
};
