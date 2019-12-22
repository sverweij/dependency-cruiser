const moduleSystemType = require("./module-system-type");

module.exports = {
  definitions: {
    ...moduleSystemType.definitions,
    ModuleSystemsType: {
      type: "array",
      description:
        "List of module systems to cruise. Defaults to [amd, cjs, es6]",
      items: { $ref: "#/definitions/ModuleSystemType" }
    }
  }
};
