// temporary webpack config until we have builtin support for exportsFields
// in dependency-cruiser
module.exports = {
  resolve: {
    exportsFields: ["exports"],
    conditionNames: ["require"],
  },
};
