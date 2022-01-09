export default {
  modules: [
    {
      source: "src/foo/bar.js",
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
      source: "src/foo/baz.js",
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
      source: "src/foo/qux.js",
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
      source: "src/foo/quuz.js",
      dependencies: [
        {
          resolved: "src/utl/quux.js",
          coreModule: false,
          followable: true,
          couldNotResolve: false,
          dependencyTypes: ["local"],
          module: "../utl/quux",
          moduleSystem: "cjs",
          dynamic: false,
          exoticallyRequired: false,
          matchesDoNotFollow: false,
          circular: false,
          valid: true,
          cycle: [],
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
      source: "src/utl/quux.js",
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
      source: "src/foo/index.js",
      dependencies: [
        {
          resolved: "src/foo/bar.js",
          coreModule: false,
          followable: true,
          couldNotResolve: false,
          dependencyTypes: ["local"],
          module: "./bar",
          moduleSystem: "cjs",
          dynamic: false,
          exoticallyRequired: false,
          matchesDoNotFollow: false,
          circular: false,
          valid: true,
          cycle: [],
        },
        {
          resolved: "src/foo/baz.js",
          coreModule: false,
          followable: true,
          couldNotResolve: false,
          dependencyTypes: ["local"],
          module: "./baz",
          moduleSystem: "cjs",
          dynamic: false,
          exoticallyRequired: false,
          matchesDoNotFollow: false,
          circular: false,
          valid: true,
          cycle: [],
        },
        {
          resolved: "src/foo/qux.js",
          coreModule: false,
          followable: true,
          couldNotResolve: false,
          dependencyTypes: ["local"],
          module: "./qux",
          moduleSystem: "cjs",
          dynamic: false,
          exoticallyRequired: false,
          matchesDoNotFollow: false,
          circular: false,
          valid: true,
          cycle: [],
        },
        {
          resolved: "src/foo/quuz.js",
          coreModule: false,
          followable: true,
          couldNotResolve: false,
          dependencyTypes: ["local"],
          module: "./quuz",
          moduleSystem: "cjs",
          dynamic: false,
          exoticallyRequired: false,
          matchesDoNotFollow: false,
          circular: false,
          valid: true,
          cycle: [],
        },
        {
          resolved: "src/foo/corge.js",
          coreModule: false,
          followable: true,
          couldNotResolve: false,
          dependencyTypes: ["local"],
          module: "./corge",
          moduleSystem: "cjs",
          dynamic: false,
          exoticallyRequired: false,
          matchesDoNotFollow: false,
          circular: false,
          valid: true,
          cycle: [],
        },
      ],
      orphan: false,
      reaches: [
        {
          asDefinedInRule: "utl-not-reachable-from-extract",
          modules: [
            {
              source: "src/utl/quux.js",
              via: ["src/foo/index.js", "src/foo/quuz.js", "src/utl/quux.js"],
            },
            {
              source: "src/utl/grault.js",
              via: [
                "src/foo/index.js",
                "src/foo/corge.js",
                "src/utl/grault.js",
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
      source: "src/foo/corge.js",
      dependencies: [
        {
          resolved: "src/utl/grault.js",
          coreModule: false,
          followable: true,
          couldNotResolve: false,
          dependencyTypes: ["local"],
          module: "../utl/grault",
          moduleSystem: "cjs",
          dynamic: false,
          exoticallyRequired: false,
          matchesDoNotFollow: false,
          circular: false,
          valid: true,
          cycle: [],
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
      source: "src/utl/grault.js",
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
        from: "src/foo/index.js",
        to: "src/utl/quux.js",
        rule: {
          severity: "error",
          name: "utl-not-reachable-from-extract",
        },
        via: ["src/foo/index.js", "src/foo/quuz.js", "src/utl/quux.js"],
        cycle: [],
      },
      {
        from: "src/foo/index.js",
        to: "src/utl/grault.js",
        rule: {
          severity: "error",
          name: "utl-not-reachable-from-extract",
        },
        via: ["src/foo/index.js", "src/foo/corge.js", "src/utl/grault.js"],
        cycle: [],
      },
      {
        from: "src/foo/bar.js",
        to: "src/foo/bar.js",
        rule: {
          severity: "info",
          name: "not-in-allowed",
        },
        cycle: [],
      },
      {
        from: "src/foo/baz.js",
        to: "src/foo/baz.js",
        rule: {
          severity: "info",
          name: "not-in-allowed",
        },
        cycle: [],
      },
      {
        from: "src/foo/qux.js",
        to: "src/foo/qux.js",
        rule: {
          severity: "info",
          name: "not-in-allowed",
        },
        cycle: [],
      },
      {
        from: "src/foo/quuz.js",
        to: "src/foo/quuz.js",
        rule: {
          severity: "info",
          name: "not-in-allowed",
        },
        cycle: [],
      },
      {
        from: "src/foo/index.js",
        to: "src/foo/index.js",
        rule: {
          severity: "info",
          name: "not-in-allowed",
        },
        cycle: [],
      },
      {
        from: "src/foo/corge.js",
        to: "src/foo/corge.js",
        rule: {
          severity: "info",
          name: "not-in-allowed",
        },
        cycle: [],
      },
      {
        from: "src/utl/quux.js",
        to: "src/utl/quux.js",
        rule: {
          severity: "info",
          name: "not-in-allowed",
        },
        cycle: [],
      },
      {
        from: "src/utl/grault.js",
        to: "src/utl/grault.js",
        rule: {
          severity: "info",
          name: "not-in-allowed",
        },
        cycle: [],
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
