import REAsStringsType from "./re-as-strings-type.mjs";

export default {
  definitions: {
    CompoundReachesType: {
      type: "object",
      additionalProperties: false,
      properties: {
        path: {
          description:
            "dependency-cruiser will include modules matching this regular expression " +
            "in its output, as well as _any_ module that reaches them - either directly " +
            "or via via",
          $ref: "#/definitions/REAsStringsType",
        },
      },
    },
    ...REAsStringsType.definitions,
  },
};
