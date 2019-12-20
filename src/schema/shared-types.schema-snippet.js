module.exports = {
  ModuleSystemType: {
    type: "array",
    description:
      "List of module systems to cruise. Defaults to [amd, cjs, es6]",
    items: {
      type: "string",
      enum: ["amd", "cjs", "es6", "tsd"]
    }
  },
  SeverityType: {
    type: "string",
    description:
      "How severe a violation of a rule is. The 'error' severity will make some reporters return a non-zero exit code, so if you want e.g. a build to stop when there's a rule violated: use that.",
    enum: ["error", "warn", "info", "ignore"]
  },
  DependencyType: {
    type: "string",
    enum: [
      "aliased",
      "core",
      "deprecated",
      "local",
      "localmodule",
      "npm",
      "npm-bundled",
      "npm-dev",
      "npm-no-pkg",
      "npm-optional",
      "npm-peer",
      "npm-unknown",
      "undetermined",
      "unknown"
    ]
  }
};
