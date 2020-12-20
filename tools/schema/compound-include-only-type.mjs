import REAsStringsType from "./re-as-strings-type.mjs";

export default {
  definitions: {
    CompoundIncludeOnlyType: {
      type: "object",
      description: "Criteria for modules to only include",
      additionalProperties: false,
      properties: {
        path: {
          description:
            "dependency-cruiser will include modules matching this regular expression " +
            "in its output, as well as their neighbours (direct dependencies and " +
            "dependents)",
          $ref: "#/definitions/REAsStringsType",
        },
      },
    },
    ...REAsStringsType.definitions,
  },
};
