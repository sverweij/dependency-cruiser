export default {
  modules: [
    {
      source: "src/hunkydory.js",
      dependencies: [],
      valid: true,
    },
  ],
  summary: {
    violations: [],
    error: 0,
    warn: 0,
    info: 0,
    totalCruised: 1,
    optionsUsed: {
      args: ["src"],
      combinedDependencies: false,
      doNotFollow: {
        dependencyTypes: [
          "npm",
          "npm-dev",
          "npm-optional",
          "npm-peer",
          "npm-bundled",
          "npm-no-pkg",
        ],
      },
      externalModuleResolutionStrategy: "node_modules",
      moduleSystems: ["amd", "cjs", "es6"],
      outputTo: "-",
      outputType: "json",
      preserveSymlinks: false,
      rulesFile: ".dependency-cruiser.js",
      tsPreCompilationDeps: false,
    },
    ruleSetUsed: {
      forbidden: [
        {
          name: "not-to-dev-dep",
          severity: "error",
          comment:
            "Don't allow dependencies from src/app/lib to a development only package",
          from: {
            path: "^(src|app|lib)",
            pathNot: "\\.spec\\.(js|ts|ls|coffee|litcoffee|coffee\\.md)$",
          },
          to: {
            dependencyTypes: ["npm-dev"],
          },
        },
        {
          name: "no-orphans",
          comment:
            "Modules without any incoming or outgoing dependencies are might indicate unused code.",
          severity: "error",
          from: {
            orphan: true,
            pathNot: "\\.d\\.ts$",
          },
          to: {},
        },
        {
          name: "no-circular",
          comment: "circular dependencies will make you dizzy",
          severity: "error",
          from: {},
          to: {
            circular: true,
          },
        },
        {
          name: "not-to-unresolvable",
          severity: "error",
          from: {},
          to: {
            couldNotResolve: true,
          },
        },
      ],
      allowed: [
        {
          from: {},
          to: {},
        },
      ],
      allowedSeverity: "warn",
    },
  },
};
