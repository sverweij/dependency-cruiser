import ruleSummary from "./rule-summary.mjs";

export default {
  definitions: {
    ViolationsType: {
      type: "array",
      description:
        "A list of violations found in the dependencies. The dependencies themselves " +
        "also contain this information, this summary is here for convenience.",
      items: { $ref: "#/definitions/ViolationType" },
    },
    ViolationType: {
      type: "object",
      required: ["from", "to", "rule"],
      additionalProperties: false,
      properties: {
        from: {
          type: "string",
        },
        to: {
          type: "string",
        },
        rule: { $ref: "#/definitions/RuleSummaryType" },
        cycle: {
          type: "array",
          items: { type: "string" },
          description:
            "The circular path if the violation is about circularity",
        },
        via: {
          type: "array",
          items: { type: "string" },
          description:
            "The path from the from to the to if the violation is transitive",
        },
      },
    },
    ...ruleSummary.definitions,
  },
};
