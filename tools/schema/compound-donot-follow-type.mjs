import REAsStringsType from "./re-as-strings-type.mjs";

export default {
  definitions: {
    CompoundDoNotFollowType: {
      type: "object",
      description: "Criteria for modules to include, but not to follow further",
      additionalProperties: false,
      properties: {
        path: {
          description:
            "a regular expression for modules to include, but not follow further",
          $ref: "#/definitions/REAsStringsType",
        },
        dependencyTypes: {
          type: "array",
          description:
            "an array of dependency types to include, but not follow further",
          items: { $ref: "#/definitions/DependencyTypeType" },
        },
      },
    },
    ...REAsStringsType.definitions,
  },
};
