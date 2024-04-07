export default {
  definitions: {
    ExperimentalStatsType: {
      type: "object",
      required: ["size", "topLevelStatementCount"],
      additionalProperties: false,
      properties: {
        topLevelStatementCount: {
          type: "number",
          description:
            "the number of top level statements in the module. Attribute only " +
            "available when the cruise was executed with the 'experimentalStats' " +
            "option set to 'true'.",
        },
        size: {
          type: "number",
          description:
            "the size of the module in bytes. Attribute only available when " +
            "the cruise was executed with the 'experimentalStats' option set to 'true'.",
        },
      },
    },
  },
};
