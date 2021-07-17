export default {
  modules: [
    {
      source: "src/extract/add-validations.js",
      dependencies: [],
      orphan: false,
      valid: false,
      rules: [
        {
          severity: "info",
          name: "not-in-allowed",
        },
      ],
    },
    {
      source: "src/extract/clear-caches.js",
      dependencies: [],
      orphan: false,
      valid: false,
      rules: [
        {
          severity: "info",
          name: "not-in-allowed",
        },
      ],
    },
    {
      source: "src/extract/gather-initial-sources.js",
      dependencies: [],
      orphan: false,
      valid: false,
      rules: [
        {
          severity: "info",
          name: "not-in-allowed",
        },
      ],
    },
    {
      source: "src/extract/get-dependencies.js",
      dependencies: [
        {
          resolved: "src/utl/array-util.js",
          coreModule: false,
          followable: true,
          couldNotResolve: false,
          dependencyTypes: ["local"],
          module: "../utl/array-util",
          moduleSystem: "cjs",
          dynamic: false,
          exoticallyRequired: false,
          matchesDoNotFollow: false,
          circular: false,
          valid: true,
        },
      ],
      orphan: false,
      valid: false,
      rules: [
        {
          severity: "info",
          name: "not-in-allowed",
        },
      ],
    },
    {
      source: "src/utl/array-util.js",
      dependencies: [],
      orphan: false,
      valid: false,
      rules: [
        {
          severity: "info",
          name: "not-in-allowed",
        },
      ],
    },
    {
      source: "src/extract/index.js",
      dependencies: [
        {
          resolved: "src/extract/add-validations.js",
          coreModule: false,
          followable: true,
          couldNotResolve: false,
          dependencyTypes: ["local"],
          module: "./add-validations",
          moduleSystem: "cjs",
          dynamic: false,
          exoticallyRequired: false,
          matchesDoNotFollow: false,
          circular: false,
          valid: true,
        },
        {
          resolved: "src/extract/clear-caches.js",
          coreModule: false,
          followable: true,
          couldNotResolve: false,
          dependencyTypes: ["local"],
          module: "./clear-caches",
          moduleSystem: "cjs",
          dynamic: false,
          exoticallyRequired: false,
          matchesDoNotFollow: false,
          circular: false,
          valid: true,
        },
        {
          resolved: "src/extract/gather-initial-sources.js",
          coreModule: false,
          followable: true,
          couldNotResolve: false,
          dependencyTypes: ["local"],
          module: "./gather-initial-sources",
          moduleSystem: "cjs",
          dynamic: false,
          exoticallyRequired: false,
          matchesDoNotFollow: false,
          circular: false,
          valid: true,
        },
        {
          resolved: "src/extract/get-dependencies.js",
          coreModule: false,
          followable: true,
          couldNotResolve: false,
          dependencyTypes: ["local"],
          module: "./get-dependencies",
          moduleSystem: "cjs",
          dynamic: false,
          exoticallyRequired: false,
          matchesDoNotFollow: false,
          circular: false,
          valid: true,
        },
        {
          resolved: "src/extract/summarize.js",
          coreModule: false,
          followable: true,
          couldNotResolve: false,
          dependencyTypes: ["local"],
          module: "./summarize",
          moduleSystem: "cjs",
          dynamic: false,
          exoticallyRequired: false,
          matchesDoNotFollow: false,
          circular: false,
          valid: true,
        },
      ],
      orphan: false,
      reaches: [
        {
          asDefinedInRule: "utl-not-reachable-from-extract",
          modules: [
            {
              source: "src/utl/array-util.js",
              via: [
                "src/extract/index.js",
                "src/extract/get-dependencies.js",
                "src/utl/array-util.js",
              ],
            },
            {
              source: "src/utl/find-rule-by-name.js",
              via: [
                "src/extract/index.js",
                "src/extract/summarize.js",
                "src/utl/find-rule-by-name.js",
              ],
            },
          ],
        },
      ],
      valid: false,
      rules: [
        {
          severity: "error",
          name: "utl-not-reachable-from-extract",
        },
        {
          severity: "info",
          name: "not-in-allowed",
        },
      ],
    },
    {
      source: "src/extract/summarize.js",
      dependencies: [
        {
          resolved: "src/utl/find-rule-by-name.js",
          coreModule: false,
          followable: true,
          couldNotResolve: false,
          dependencyTypes: ["local"],
          module: "../utl/find-rule-by-name",
          moduleSystem: "cjs",
          dynamic: false,
          exoticallyRequired: false,
          matchesDoNotFollow: false,
          circular: false,
          valid: true,
        },
      ],
      orphan: false,
      valid: false,
      rules: [
        {
          severity: "info",
          name: "not-in-allowed",
        },
      ],
    },
    {
      source: "src/utl/find-rule-by-name.js",
      dependencies: [],
      orphan: false,
      valid: false,
      rules: [
        {
          severity: "info",
          name: "not-in-allowed",
        },
      ],
    },
  ],
  summary: {
    violations: [
      {
        from: "src/extract/index.js",
        to: "src/utl/array-util.js",
        rule: {
          severity: "error",
          name: "utl-not-reachable-from-extract",
        },
        via: [
          "src/extract/index.js",
          "src/extract/get-dependencies.js",
          "src/utl/array-util.js",
        ],
      },
      {
        from: "src/extract/index.js",
        to: "src/utl/find-rule-by-name.js",
        rule: {
          severity: "error",
          name: "utl-not-reachable-from-extract",
        },
        via: [
          "src/extract/index.js",
          "src/extract/summarize.js",
          "src/utl/find-rule-by-name.js",
        ],
      },
      {
        from: "src/extract/add-validations.js",
        to: "src/extract/add-validations.js",
        rule: {
          severity: "info",
          name: "not-in-allowed",
        },
      },
      {
        from: "src/extract/clear-caches.js",
        to: "src/extract/clear-caches.js",
        rule: {
          severity: "info",
          name: "not-in-allowed",
        },
      },
      {
        from: "src/extract/gather-initial-sources.js",
        to: "src/extract/gather-initial-sources.js",
        rule: {
          severity: "info",
          name: "not-in-allowed",
        },
      },
      {
        from: "src/extract/get-dependencies.js",
        to: "src/extract/get-dependencies.js",
        rule: {
          severity: "info",
          name: "not-in-allowed",
        },
      },
      {
        from: "src/extract/index.js",
        to: "src/extract/index.js",
        rule: {
          severity: "info",
          name: "not-in-allowed",
        },
      },
      {
        from: "src/extract/summarize.js",
        to: "src/extract/summarize.js",
        rule: {
          severity: "info",
          name: "not-in-allowed",
        },
      },
      {
        from: "src/utl/array-util.js",
        to: "src/utl/array-util.js",
        rule: {
          severity: "info",
          name: "not-in-allowed",
        },
      },
      {
        from: "src/utl/find-rule-by-name.js",
        to: "src/utl/find-rule-by-name.js",
        rule: {
          severity: "info",
          name: "not-in-allowed",
        },
      },
    ],
    error: 2,
    warn: 0,
    info: 8,
    totalCruised: 8,
    totalDependenciesCruised: 7,
    optionsUsed: {
      combinedDependencies: false,
      exclude: {
        path: "^src/extract/[^/]+/[^.]+\\.js$",
      },
      externalModuleResolutionStrategy: "node_modules",
      includeOnly: { path: "^src/(utl|extract/[^.]+\\.js$)" },
      moduleSystems: ["amd", "cjs", "es6"],
      outputTo: "-",
      outputType: "json",
      preserveSymlinks: false,
      rulesFile: "tmp-reachable.js",
      tsPreCompilationDeps: false,
      exoticRequireStrings: [],
      args: "src",
    },
    ruleSetUsed: {
      forbidden: [
        {
          name: "utl-not-reachable-from-extract",
          severity: "error",
          from: {
            path: "^src/extract/index\\.js$",
          },
          to: {
            path: "^src/utl",
            reachable: true,
          },
        },
      ],
      allowed: [
        {
          from: {},
          to: {},
        },
        {
          from: {
            path: "^src/cli",
          },
          to: {
            path: "^src",
            reachable: false,
          },
        },
      ],
      allowedSeverity: "info",
    },
  },
};
