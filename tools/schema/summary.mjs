import optionsUsed from "./options-used.mjs";
import ruleSet from "./rule-set.mjs";
import violations from "./violations.mjs";
import severityType from "./severity-type.mjs";

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
        environment: {
          type: "object",
          description: "information on the environment the cruise ran on",
          required: [
            "version",
            "nodeVersionSupported",
            "nodeVersionFound",
            "osVersionFound",
            "transpilersFound",
            "extensionsFound",
          ],
          additionalProperties: false,
          properties: {
            version: { type: "string" },
            nodeVersionSupported: { type: "string" },
            nodeVersionFound: { type: "string" },
            osVersionFound: { type: "string" },
            transpilersFound: {
              type: "array",
              items: {
                type: "object",
                required: ["name", "version", "available", "currentVersion"],
                additionalProperties: false,
                properties: {
                  name: { type: "string" },
                  version: { type: "string" },
                  available: { type: "boolean" },
                  currentVersion: { type: "string" },
                },
              },
            },
            extensionsFound: {
              type: "array",
              items: {
                type: "object",
                required: ["extension", "available"],
                additionalProperties: false,
                properties: {
                  extension: { type: "string" },
                  available: { type: "boolean" },
                },
              },
            },
            issues: {
              type: "array",
              items: {
                type: "object",
                required: ["severity", "name", "description"],
                additionalProperties: false,
                description:
                  "Issues detected in the environment that might have influenced the cruise " +
                  "e.g. a missing (supported) typescript transpiler, while there's a tsconfig",
                properties: {
                  severity: { $ref: "#/definitions/SeverityType" },
                  name: { type: "string" },
                  description: { type: "string" },
                },
              },
            },
          },
        },

        ruleSetUsed: { $ref: "#/definitions/RuleSetType" },
        optionsUsed: { $ref: "#/definitions/OptionsUsedType" },
      },
    },
    ...violations.definitions,
    ...ruleSet.definitions,
    ...optionsUsed.definitions,
    ...severityType.definitions,
  },
};
