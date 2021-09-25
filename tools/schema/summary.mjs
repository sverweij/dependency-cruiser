import optionsUsed from "./options-used.mjs";
import ruleSet from "./rule-set.mjs";
import violations from "./violations.mjs";

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
        ignore: {
          type: "number",
          description: "the number of ignored notices in the dependencies",
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
    ...violations.definitions,
    ...ruleSet.definitions,
    ...optionsUsed.definitions,
  },
};
