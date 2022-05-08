export default {
  modules: [
    {
      source: "baz/index.js",
      dependencies: [
        {
          module: "../foo/bar",
          moduleSystem: "cjs",
          dynamic: false,
          exoticallyRequired: false,
          resolved: "foo/bar.js",
          coreModule: false,
          followable: true,
          couldNotResolve: false,
          dependencyTypes: ["local"],
          matchesDoNotFollow: false,
          circular: false,
          instability: 0,
          valid: true,
          cycle: [],
        },
      ],
      dependents: ["qux/index.js"],
      orphan: false,
      instability: 0.5,
      valid: true,
    },
    {
      source: "foo/bar.js",
      dependencies: [],
      dependents: ["baz/index.js"],
      orphan: false,
      instability: 0,
      valid: true,
    },
    {
      source: "qux/index.js",
      dependencies: [
        {
          module: "../baz",
          moduleSystem: "cjs",
          dynamic: false,
          exoticallyRequired: false,
          resolved: "baz/index.js",
          coreModule: false,
          followable: true,
          couldNotResolve: false,
          dependencyTypes: ["local"],
          matchesDoNotFollow: false,
          circular: false,
          instability: 0.5,
          valid: true,
          cycle: [],
        },
      ],
      dependents: [],
      orphan: false,
      instability: 1,
      valid: true,
    },
    {
      source: "qux/bar.js",
      dependencies: [],
      dependents: ["foo/index.js"],
      orphan: false,
      instability: 0,
      valid: true,
    },
    {
      source: "foo/index.js",
      dependencies: [
        {
          module: "../qux/bar",
          moduleSystem: "cjs",
          dynamic: false,
          exoticallyRequired: false,
          resolved: "qux/bar.js",
          coreModule: false,
          followable: true,
          couldNotResolve: false,
          dependencyTypes: ["local"],
          matchesDoNotFollow: false,
          circular: false,
          instability: 0,
          valid: true,
          cycle: [],
        },
      ],
      dependents: [],
      orphan: false,
      instability: 1,
      valid: true,
    },
  ],
  folders: [
    {
      name: "baz",
      dependencies: [
        {
          name: "foo",
          instability: 0.5,
          circular: true,
          cycle: ["foo", "qux", "baz"],
          valid: false,
          rules: [
            {
              severity: "warn",
              name: "no-folder-cycles",
            },
          ],
        },
      ],
      dependents: [
        {
          name: "qux",
        },
      ],
      moduleCount: 1,
      afferentCouplings: 1,
      efferentCouplings: 1,
      instability: 0.5,
    },
    {
      name: "foo",
      dependencies: [
        {
          name: "qux",
          instability: 0.5,
          circular: true,
          cycle: ["qux", "baz", "foo"],
          valid: false,
          rules: [
            {
              severity: "warn",
              name: "no-folder-cycles",
            },
          ],
        },
      ],
      dependents: [
        {
          name: "baz",
        },
      ],
      moduleCount: 2,
      afferentCouplings: 1,
      efferentCouplings: 1,
      instability: 0.5,
    },
    {
      name: "qux",
      dependencies: [
        {
          name: "baz",
          instability: 0.5,
          circular: true,
          cycle: ["baz", "foo", "qux"],
          valid: false,
          rules: [
            {
              severity: "warn",
              name: "no-folder-cycles",
            },
          ],
        },
      ],
      dependents: [
        {
          name: "foo",
        },
      ],
      moduleCount: 2,
      afferentCouplings: 1,
      efferentCouplings: 1,
      instability: 0.5,
    },
  ],
  summary: {
    violations: [
      {
        type: "cycle",
        from: "baz",
        to: "foo",
        rule: {
          severity: "warn",
          name: "no-folder-cycles",
        },
        cycle: ["foo", "qux", "baz"],
      },
      {
        type: "cycle",
        from: "qux",
        to: "baz",
        rule: {
          severity: "warn",
          name: "no-folder-cycles",
        },
        cycle: ["baz", "foo", "qux"],
      },
      {
        type: "cycle",
        from: "foo",
        to: "qux",
        rule: {
          severity: "warn",
          name: "no-folder-cycles",
        },
        cycle: ["qux", "baz", "foo"],
      },
    ],
    error: 0,
    warn: 3,
    info: 0,
    ignore: 0,
    totalCruised: 6,
    totalDependenciesCruised: 3,
    optionsUsed: {
      combinedDependencies: false,
      doNotFollow: {
        path: "node_modules",
      },
      externalModuleResolutionStrategy: "node_modules",
      moduleSystems: ["es6", "cjs", "tsd", "amd"],
      outputTo: "-",
      outputType: "json",
      preserveSymlinks: false,
      rulesFile: ".dependency-cruiser.js",
      tsPreCompilationDeps: false,
      exoticRequireStrings: [],
      args: ".",
    },
    ruleSetUsed: {
      forbidden: [
        {
          scope: "module",
          name: "no-module-cycles",
          severity: "warn",
          from: {},
          to: {
            circular: true,
          },
        },
        {
          scope: "folder",
          name: "no-folder-cycles",
          severity: "warn",
          from: {},
          to: {
            circular: true,
          },
        },
      ],
    },
  },
};
