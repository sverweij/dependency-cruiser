import dependencyType from "./dependency-type.mjs";

export default {
  definitions: {
    MiniDependency: {
      type: "object",
      description:
        "A small dependency object with the uniquely identifying name of the module +" +
        "the dependency types it has relative to the _previous_ module in the chain " +
        " it is part of (e.g. a cycle).",
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
            "The dependency types of the module relative to the previous module " +
            "in the chain it is a part of (e.g. a cycle)",
        },
      },
    },
    ...dependencyType.definitions,
  },
};
