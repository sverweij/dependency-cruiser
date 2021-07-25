export default {
  modules: [
    {
      source: "src/main/options/normalize.js",
      dependencies: [
        {
          resolved: "src/main/options/defaults.json",
          coreModule: false,
          followable: false,
          couldNotResolve: false,
          dependencyTypes: ["local"],
          module: "./defaults.json",
          moduleSystem: "cjs",
          matchesDoNotFollow: false,
          circular: false,
          valid: false,
          rules: [
            {
              severity: "warn",
              name: "everything-to-defaults-is-a-violation",
            },
            {
              severity: "info",
              name: "everything-is-a-violation",
            },
          ],
        },
      ],
    },
    {
      source: "src/main/options/defaults.json",
      followable: false,
      coreModule: false,
      couldNotResolve: false,
      matchesDoNotFollow: false,
      dependencyTypes: ["local"],
      dependencies: [],
    },
    {
      source: "src/main/options/validate.js",
      dependencies: [
        {
          resolved: "node_modules/safe-regex/index.js",
          coreModule: false,
          followable: false,
          couldNotResolve: false,
          dependencyTypes: ["npm"],
          license: "MIT",
          module: "safe-regex",
          moduleSystem: "cjs",
          matchesDoNotFollow: true,
          circular: false,
          valid: false,
          rules: [
            {
              severity: "info",
              name: "everything-is-a-violation",
            },
          ],
        },
      ],
    },
    {
      source: "node_modules/safe-regex/index.js",
      followable: false,
      coreModule: false,
      couldNotResolve: false,
      matchesDoNotFollow: true,
      dependencyTypes: ["npm"],
      dependencies: [],
    },
  ],
  summary: {
    violations: [
      {
        from: "src/main/options/normalize.js",
        to: "src/main/options/defaults.json",
        rule: {
          severity: "warn",
          name: "everything-to-defaults-is-a-violation",
        },
      },
      {
        from: "src/main/options/normalize.js",
        to: "src/main/options/defaults.json",
        rule: {
          severity: "info",
          name: "everything-is-a-violation",
        },
      },
      {
        from: "src/main/options/validate.js",
        to: "node_modules/safe-regex/index.js",
        rule: {
          severity: "info",
          name: "everything-is-a-violation",
        },
      },
    ],
    error: 0,
    warn: 1,
    info: 2,
    totalCruised: 4,
    optionsUsed: {
      rulesFile: ".dependency-cruiser-custom.json",
      outputTo: "-",
      doNotFollow: "^node_modules",
      exclude: "fixtures",
      moduleSystems: ["amd", "cjs", "es6"],
      outputType: "json",
      prefix: "https://github.com/sverweij/dependency-cruiser/blob/develop/",
      tsPreCompilationDeps: false,
      preserveSymlinks: false,
    },
  },
};
