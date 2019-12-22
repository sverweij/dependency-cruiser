module.exports = {
  definitions: {
    CompoundExcludeType: {
      type: "object",
      description: "Criteria for dependencies to exclude",
      additionalProperties: false,
      properties: {
        path: {
          type: "string",
          description:
            "a regular expression for modules to exclude from being cruised"
        },
        dynamic: {
          type: "boolean",
          description:
            "a boolean indicating whether or not to exclude dynamic dependencies"
        }
      }
    }
  }
};
