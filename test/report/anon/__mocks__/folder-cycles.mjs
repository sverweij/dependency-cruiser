export default {
  modules: [
    {
      source: "cycle-one/index.js",
      dependencies: [
        {
          module: "../cycle-two/thing",
          moduleSystem: "cjs",
          dynamic: false,
          exoticallyRequired: false,
          resolved: "cycle-two/thing.js",
          coreModule: false,
          followable: true,
          couldNotResolve: false,
          dependencyTypes: ["local"],
          matchesDoNotFollow: false,
          circular: false,
          instability: 0,
          valid: true,
        },
      ],
      dependents: ["cycle-three/index.js"],
      orphan: false,
      instability: 0.5,
      valid: true,
    },
    {
      source: "cycle-two/thing.js",
      dependencies: [],
      dependents: ["cycle-one/index.js"],
      orphan: false,
      instability: 0,
      valid: true,
    },
    {
      source: "cycle-three/index.js",
      dependencies: [
        {
          module: "../cycle-one",
          moduleSystem: "cjs",
          dynamic: false,
          exoticallyRequired: false,
          resolved: "cycle-one/index.js",
          coreModule: false,
          followable: true,
          couldNotResolve: false,
          dependencyTypes: ["local"],
          matchesDoNotFollow: false,
          circular: false,
          instability: 0.5,
          valid: true,
        },
      ],
      dependents: [],
      orphan: false,
      instability: 1,
      valid: true,
    },
    {
      source: "cycle-three/thing.js",
      dependencies: [],
      dependents: ["cycle-two/index.js"],
      orphan: false,
      instability: 0,
      valid: true,
    },
    {
      source: "cycle-two/index.js",
      dependencies: [
        {
          module: "../cycle-three/thing",
          moduleSystem: "cjs",
          dynamic: false,
          exoticallyRequired: false,
          resolved: "cycle-three/thing.js",
          coreModule: false,
          followable: true,
          couldNotResolve: false,
          dependencyTypes: ["local"],
          matchesDoNotFollow: false,
          circular: false,
          instability: 0,
          valid: true,
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
      name: "cycle-one",
      dependencies: [
        {
          name: "cycle-two",
          instability: 0.5,
          circular: true,
          cycle: [
            { name: "cycle-two", dependencyTypes: [] },
            { name: "cycle-three", dependencyTypes: [] },
            { name: "cycle-one", dependencyTypes: [] },
          ],
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
          name: "cycle-three",
        },
      ],
      moduleCount: 1,
      afferentCouplings: 1,
      efferentCouplings: 1,
      instability: 0.5,
    },
    {
      name: "cycle-two",
      dependencies: [
        {
          name: "cycle-three",
          instability: 0.5,
          circular: true,
          cycle: [
            { name: "cycle-three", dependencyTypes: [] },
            { name: "cycle-one", dependencyTypes: [] },
            { name: "cycle-two", dependencyTypes: [] },
          ],
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
          name: "cycle-one",
        },
      ],
      moduleCount: 2,
      afferentCouplings: 1,
      efferentCouplings: 1,
      instability: 0.5,
    },
    {
      name: "cycle-three",
      dependencies: [
        {
          name: "cycle-one",
          instability: 0.5,
          circular: true,
          cycle: [
            { name: "cycle-one", dependencyTypes: [] },
            { name: "cycle-two", dependencyTypes: [] },
            { name: "cycle-three", dependencyTypes: [] },
          ],
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
          name: "cycle-two",
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
        from: "cycle-one",
        to: "cycle-two",
        rule: {
          severity: "warn",
          name: "no-folder-cycles",
        },
        cycle: [
          { name: "cycle-two", dependencyTypes: [] },
          { name: "cycle-three", dependencyTypes: [] },
          { name: "cycle-one", dependencyTypes: [] },
        ],
      },
      {
        type: "cycle",
        from: "cycle-three",
        to: "cycle-one",
        rule: {
          severity: "warn",
          name: "no-folder-cycles",
        },
        cycle: [
          { name: "cycle-one", dependencyTypes: [] },
          { name: "cycle-two", dependencyTypes: [] },
          { name: "cycle-three", dependencyTypes: [] },
        ],
      },
      {
        type: "cycle",
        from: "cycle-two",
        to: "cycle-three",
        rule: {
          severity: "warn",
          name: "no-folder-cycles",
        },
        cycle: [
          { name: "cycle-three", dependencyTypes: [] },
          { name: "cycle-one", dependencyTypes: [] },
          { name: "cycle-two", dependencyTypes: [] },
        ],
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
