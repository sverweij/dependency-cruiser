import dependencyType from "./dependency-type.mjs";

export default {
  definitions: {
    CycleEntryType: {
      type: "object",
      description: "A module in a cycle",
      required: ["name", "dependencyTypes"],
      additionalProperties: false,
      properties: {
        name: {
          type: "string",
          description: "The name of the module",
        },
        dependencyTypes: {
          type: "array",
          items: { $ref: "#/definitions/DependencyTypeType" },
          description:
            "the type of inclusion - local, core, unknown (= we honestly don't " +
            "know), undetermined (= we didn't bother determining it) or one of " +
            "the npm dependencies defined in a package.json ('npm' for 'dependencies', " +
            "'npm-dev', 'npm-optional', 'npm-peer', 'npm-no-pkg' for development, " +
            "optional, peer dependencies and dependencies in node_modules but not " +
            "in package.json respectively)",
        },
      },
    },
    ...dependencyType.definitions,
  },
};
