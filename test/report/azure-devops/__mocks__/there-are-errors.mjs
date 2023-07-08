/** @type {import("../../../../types/cruise-result").ICruiseResult} */
export default {
  modules: [
    {
      source: "src/hunkydory.js",
      dependencies: [],
      valid: true,
      dependencies: [
        {
          resolved: "node_modules/hunky/dist/index.js",
          coreModule: false,
          followable: false,
          couldNotResolve: false,
          dependencyTypes: ["npm-dev"],
          dynamic: false,
          module: "hunky",
          moduleSystem: "es6",
          valid: true,
          rules: [
            {
              severity: "error",
              name: "no-circular",
            },
          ],
        },
      ],
    },
    {
      source: "node_modules/hunky/dist/index.js",
      followable: false,
      coreModule: false,
      couldNotResolve: false,
      matchesDoNotFollow: true,
      dependencyTypes: ["npm-dev"],
      dependencies: [],
      dependents: ["src/hunkydory.js"],
      orphan: false,
      valid: true,
    },
  ],
  summary: {
    violations: [],
    error: 1,
    warn: 0,
    info: 0,
    totalCruised: 2,
    totalDependenciesCruised: 1,
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
    violations: [
      {
        type: "dependency",
        from: "src/hunkydory.js",
        to: "node_modules/hunky/dist/index.js",
        rule: {
          severity: "error",
          name: "not-to-dev-dep",
        },
      },
    ],
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
