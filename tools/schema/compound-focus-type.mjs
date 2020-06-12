import REAsStringsType from "./re-as-strings-type.mjs";

export default {
  definitions: {
    CompoundFocusType: {
      type: "object",
      description: "Criteria for modules to 'focus' on",
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
      ...REAsStringsType.definitions,
    },
  },
};
