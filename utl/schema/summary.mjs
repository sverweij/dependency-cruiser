import optionsUsed from "./options-used.mjs";
import ruleSet from "./rule-set.mjs";

export default {
  definitions: {
    SummaryType: {
      type: "object",
      required: [
        "violations",
        "error",
        "warn",
        "info",
        "totalCruised",
        "optionsUsed",
      ],
      additionalProperties: false,
      description: "Data summarizing the found dependencies",
      properties: {
        violations: { $ref: "#/definitions/ViolationsType" },
        error: {
          type: "number",
          description: "the number of errors in the dependencies",
        },
        warn: {
          type: "number",
          description: "the number of warnings in the dependencies",
        },
        info: {
          type: "number",
          description:
            "the number of informational level notices in the dependencies",
        },
        totalCruised: {
          type: "number",
          description: "the number of modules cruised",
        },
        totalDependenciesCruised: {
          type: "number",
          description: "the number of dependencies cruised",
        },
        ruleSetUsed: { $ref: "#/definitions/RuleSetType" },
        optionsUsed: { $ref: "#/definitions/OptionsUsedType" },
      },
    },
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
    ...ruleSet.definitions,
    ...optionsUsed.definitions,
  },
};
