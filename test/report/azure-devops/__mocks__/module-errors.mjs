export default {
  modules: [
    {
      source: "src/asneeze.js",
      dependencies: [
        {
          resolved: "node_modules/eslint/lib/api.js",
          coreModule: false,
          followable: false,
          couldNotResolve: false,
          dependencyTypes: ["npm-dev"],
          license: "MIT",
          module: "eslint",
          moduleSystem: "cjs",
          matchesDoNotFollow: true,
          circular: false,
          valid: false,
          rules: [
            {
              severity: "error",
              name: "not-to-dev-dep",
            },
          ],
        },
      ],
      valid: true,
    },
    {
      source: "node_modules/eslint/lib/api.js",
      followable: false,
      coreModule: false,
      couldNotResolve: false,
      matchesDoNotFollow: true,
      dependencyTypes: ["npm-dev"],
      dependencies: [],
      valid: true,
    },
    {
      source: "src/hunkydory.js",
      dependencies: [],
      valid: true,
    },
    {
      source: "src/index.js",
      dependencies: [
        {
          resolved: "src/asneeze.js",
          coreModule: false,
          followable: true,
          couldNotResolve: false,
          dependencyTypes: ["local"],
          module: "./asneeze",
          moduleSystem: "cjs",
          matchesDoNotFollow: false,
          circular: false,
          valid: true,
        },
        {
          resolved: "src/hunkydory.js",
          coreModule: false,
          followable: true,
          couldNotResolve: false,
          dependencyTypes: ["local"],
          module: "./hunkydory",
          moduleSystem: "cjs",
          matchesDoNotFollow: false,
          circular: false,
          valid: true,
        },
        {
          resolved: "./medontexist.json",
          coreModule: false,
          followable: false,
          couldNotResolve: true,
          dependencyTypes: ["unknown"],
          module: "./medontexist.json",
          moduleSystem: "cjs",
          matchesDoNotFollow: false,
          circular: false,
          valid: false,
          rules: [
            {
              severity: "error",
              name: "not-to-unresolvable",
            },
          ],
        },
        {
          resolved: "node_modules/dependency-cruiser/src/main/index.js",
          coreModule: false,
          followable: false,
          couldNotResolve: false,
          dependencyTypes: ["npm-dev"],
          license: "MIT",
          module: "dependency-cruiser",
          moduleSystem: "cjs",
          matchesDoNotFollow: true,
          circular: false,
          valid: false,
          rules: [
            {
              severity: "error",
              name: "not-to-dev-dep",
            },
          ],
        },
        {
          resolved: "node_modules/eslint/lib/api.js",
          coreModule: false,
          followable: false,
          couldNotResolve: false,
          dependencyTypes: ["npm-dev"],
          license: "MIT",
          module: "eslint",
          moduleSystem: "cjs",
          matchesDoNotFollow: true,
          circular: false,
          valid: false,
          rules: [
            {
              severity: "error",
              name: "not-to-dev-dep",
            },
          ],
        },
      ],
      valid: true,
    },
    {
      source: "./medontexist.json",
      followable: false,
      coreModule: false,
      couldNotResolve: true,
      matchesDoNotFollow: false,
      dependencyTypes: ["unknown"],
      dependencies: [],
      valid: true,
    },
    {
      source: "node_modules/dependency-cruiser/src/main/index.js",
      followable: false,
      coreModule: false,
      couldNotResolve: false,
      matchesDoNotFollow: true,
      dependencyTypes: ["npm-dev"],
      dependencies: [],
      valid: true,
    },
    {
      source: "src/orphan.js",
      dependencies: [],
      orphan: true,
      valid: false,
      rules: [
        {
          severity: "error",
          name: "no-orphans",
        },
      ],
    },
  ],
  summary: {
    violations: [
      {
        type: "dependency",
        from: "src/asneeze.js",
        to: "node_modules/eslint/lib/api.js",
        rule: {
          severity: "error",
          name: "not-to-dev-dep",
        },
      },
      {
        type: "dependency",
        from: "src/index.js",
        to: "./medontexist.json",
        rule: {
          severity: "error",
          name: "not-to-unresolvable",
        },
      },
      {
        type: "dependency",
        from: "src/index.js",
        to: "node_modules/dependency-cruiser/src/main/index.js",
        rule: {
          severity: "error",
          name: "not-to-dev-dep",
        },
      },
      {
        type: "dependency",
        from: "src/index.js",
        to: "node_modules/eslint/lib/api.js",
        rule: {
          severity: "error",
          name: "not-to-dev-dep",
        },
      },
      {
        type: "module",
        from: "src/orphan.js",
        to: "src/orphan.js",
        rule: {
          severity: "error",
          name: "no-orphans",
        },
      },
      {
        type: "dependency",
        from: "src/index.js",
        to: "./medontexist.json",
        rule: {
          severity: "warn",
          name: "not-in-allowed",
        },
      },
    ],
    error: 5,
    warn: 0,
    info: 0,
    totalCruised: 7,
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
          from: {
            path: "src",
          },
          to: {
            path: "^(src|node_modules)",
          },
        },
      ],
      allowedSeverity: "warn",
    },
  },
};
