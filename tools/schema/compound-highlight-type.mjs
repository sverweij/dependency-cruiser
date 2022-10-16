import REAsStringsType from "./re-as-strings-type.mjs";

export default {
  definitions: {
    CompoundHighlightType: {
      type: "object",
      additionalProperties: false,
      properties: {
        path: {
          description:
            "dependency-cruiser will mark modules matching this regular expression " +
            "as 'highlighted' in its output",
          $ref: "#/definitions/REAsStringsType",
        },
      },
    },
    ...REAsStringsType.definitions,
  },
};
