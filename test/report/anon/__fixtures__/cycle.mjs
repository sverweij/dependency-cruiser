export default {
  modules: [
    {
      source: "src/bar.js",
      dependencies: [
        {
          resolved: "src/foo.js",
          coreModule: false,
          followable: true,
          couldNotResolve: false,
          dependencyTypes: ["local"],
          module: "./foo",
          moduleSystem: "cjs",
          dynamic: false,
          matchesDoNotFollow: false,
          circular: true,
          cycle: ["src/foo.js", "src/bar.js"],
          exoticallyRequired: false,
          valid: false,
          rules: [
            {
              severity: "warn",
              name: "no-circular",
            },
          ],
        },
      ],
      orphan: false,
      valid: true,
    },
    {
      source: "src/foo.js",
      dependencies: [
        {
          resolved: "src/bar.js",
          coreModule: false,
          followable: true,
          couldNotResolve: false,
          dependencyTypes: ["local"],
          module: "./bar",
          moduleSystem: "cjs",
          dynamic: false,
          matchesDoNotFollow: false,
          circular: true,
          cycle: ["src/bar.js", "src/foo.js"],
          exoticallyRequired: false,
          valid: false,
          rules: [
            {
              severity: "warn",
              name: "no-circular",
            },
          ],
        },
      ],
      orphan: false,
      valid: true,
    },
    {
      source: "src/baz.js",
      dependencies: [],
      orphan: true,
      valid: false,
      rules: [
        {
          severity: "warn",
          name: "no-orphans",
        },
      ],
    },
  ],
  summary: {
    violations: [
      {
        from: "src/bar.js",
        to: "src/foo.js",
        rule: {
          severity: "warn",
          name: "no-circular",
        },
        cycle: ["src/foo.js", "src/bar.js"],
      },
      {
        from: "src/foo.js",
        to: "src/bar.js",
        rule: {
          severity: "warn",
          name: "no-circular",
        },
        cycle: ["src/bar.js", "src/foo.js"],
      },
      {
        from: "src/baz.js",
        to: "src/baz.js",
        rule: {
          severity: "warn",
          name: "no-orphans",
        },
        cycle: [],
      },
    ],
    error: 0,
    warn: 3,
    info: 0,
    totalCruised: 3,
    totalDependenciesCruised: 2,
    optionsUsed: {
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
      args: "src",
    },
    ruleSetUsed: {
      forbidden: [
        {
          name: "no-circular",
          severity: "warn",
          comment:
            "This dependency is part of a circular relationship. You might want to revise your solution (i.e. use dependency inversion, make sure the modules have a single responsibility) ",
          from: {},
          to: {
            circular: true,
          },
        },
        {
          name: "no-orphans",
          severity: "warn",
          comment:
            "This dependency is part of a circular relationship. You might want to revise your solution (i.e. use dependency inversion, make sure the modules have a single responsibility) ",
          from: {
            orphan: true,
          },
          to: {},
        },
      ],
    },
  },
};
