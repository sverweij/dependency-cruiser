import moduleSystemType from "./module-system-type.mjs";

export default {
  definitions: {
    ...moduleSystemType.definitions,
    ModuleSystemsType: {
      type: "array",
      description:
        "List of module systems to cruise. Defaults to [amd, cjs, es6]",
      items: { $ref: "#/definitions/ModuleSystemType" },
    },
  },
};
