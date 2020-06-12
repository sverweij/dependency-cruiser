import REAsStringsType from "./re-as-strings-type.mjs";

export default {
  definitions: {
    CompoundExcludeType: {
      type: "object",
      description: "Criteria for dependencies to exclude",
      additionalProperties: false,
      properties: {
        path: {
          description:
            "a regular expression for modules to exclude from being cruised",
          $ref: "#/definitions/REAsStringsType",
        },
        dynamic: {
          type: "boolean",
          description:
            "a boolean indicating whether or not to exclude dynamic dependencies",
        },
      },
      ...REAsStringsType.definitions,
    },
  },
};
