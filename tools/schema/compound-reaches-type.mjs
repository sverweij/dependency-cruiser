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
            "or via via. This matches against _resolved_ paths only ('node_modules/chalk/source/index.js', " +
            "'src/utl/useful.ts as opposed to the unresolved paths ('chalk', @aliased-utl/useful). " +
            "If you want to use the unresolved paths, use pathUnresolved.",
          $ref: "#/definitions/REAsStringsType",
        },
        pathUnresolved: {
          description:
            "dependency-cruiser will include modules _equal_ to this (/ these) string(s) " +
            "in its output, as well as _any_ module that reaches them - either directly " +
            "or via via. This takes unresolved ('chalk', @aliased-utl/useful) paths. " +
            "For _resolved_ paths use `path` ",
        },
      },
    },
    ...REAsStringsType.definitions,
  },
};
