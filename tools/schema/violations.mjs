import ruleSummary from "./rule-summary.mjs";
import violationType from "./violation-type.mjs";

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
        type: { $ref: "#/definitions/ViolationTypeType" },
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
        metrics: {
          type: "object",
          required: ["from", "to"],
          additionalProperties: false,
          properties: {
            from: {
              type: "object",
              required: ["instability"],
              additionalProperties: false,
              properties: {
                instability: { type: "number" },
              },
            },
            to: {
              type: "object",
              required: ["instability"],
              additionalProperties: false,
              properties: {
                instability: { type: "number" },
              },
            },
          },
        },
        comment: {
          type: "string",
          description:
            "Free format text you can e.g. use to explain why this violation " +
            "can be ignored or is quarantined (only used in _known-violations_) ",
        },
      },
    },
    ...ruleSummary.definitions,
    ...violationType.definitions,
  },
};
