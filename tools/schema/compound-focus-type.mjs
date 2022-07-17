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
        depth: {
          description:
            "by default 'focus' only inlcudes the direct neighbours of the focus'ed module(s). " +
            "This property makes dependency-cruiser will also include neighbors of neighbors, " +
            "up to the specified depth.",
          type: "number",
          minimum: 1,
          maximum: 4,
        },
      },
    },
    ...REAsStringsType.definitions,
  },
};
