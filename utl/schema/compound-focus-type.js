module.exports = {
  definitions: {
    CompoundFocusType: {
      type: "object",
      description: "Criteria for modules to 'focus' on",
      additionalProperties: false,
      properties: {
        path: {
          type: "string",
          description:
            "dependency-cruiser will include modules matching this regular expression " +
            "in its output, as well as their neighbours (direct dependencies and " +
            "dependents)",
        },
      },
    },
  },
};
