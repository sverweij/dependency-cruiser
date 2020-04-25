module.exports = {
  definitions: {
    CompoundDoNotFollowType: {
      type: "object",
      description: "Criteria for modules to include, but not to follow further",
      additionalProperties: false,
      properties: {
        path: {
          type: "string",
          description:
            "a regular expression for modules to include, but not follow further",
        },
        dependencyTypes: {
          type: "array",
          description:
            "an array of dependency types to include, but not follow further",
          items: { $ref: "#/definitions/DependencyTypeType" },
        },
      },
    },
  },
};
