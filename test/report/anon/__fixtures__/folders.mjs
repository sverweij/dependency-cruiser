export default {
  modules: [],
  folders: [
    {
      name: "src",
      dependencies: [],
      dependents: [],
      moduleCount: 30,
      afferentCouplings: 0,
      efferentCouplings: 0,
      instability: 0,
    },
    {
      name: "src/foo",
      dependencies: [],
      dependents: [],
      moduleCount: 30,
      afferentCouplings: 0,
      efferentCouplings: 0,
      instability: 0,
    },
    {
      name: "src/foo/bar",
      dependencies: [],
      dependents: [
        {
          name: "src/foo",
        },
      ],
      moduleCount: 4,
      afferentCouplings: 1,
      efferentCouplings: 0,
      instability: 0,
    },
    {
      name: "src/foo/utl",
      dependencies: [],
      dependents: [
        {
          name: "src/foo",
        },
        {
          name: "src/foo/baz",
        },
        {
          name: "src/foo/qux",
        },
        {
          name: "src/foo/quux",
        },
      ],
      moduleCount: 2,
      afferentCouplings: 6,
      efferentCouplings: 0,
      instability: 0,
    },
    {
      name: "src/foo/qux",
      dependencies: [
        {
          name: "src/foo/utl",
          instability: 0,
          circular: false,
          valid: true,
        },
      ],
      dependents: [
        {
          name: "src/foo",
        },
      ],
      moduleCount: 8,
      afferentCouplings: 1,
      efferentCouplings: 1,
      instability: 0.5,
    },
    {
      name: "src/foo/quux",
      dependencies: [
        {
          name: "src/foo/utl",
          instability: 0,
          circular: false,
          valid: true,
        },
      ],
      dependents: [
        {
          name: "src/foo",
        },
      ],
      moduleCount: 3,
      afferentCouplings: 1,
      efferentCouplings: 1,
      instability: 0.5,
    },
    {
      name: "src/foo/baz",
      dependencies: [
        {
          name: "src/foo/utl",
          instability: 0,
          circular: false,
          valid: true,
        },
      ],
      dependents: [
        {
          name: "src/foo",
        },
      ],
      moduleCount: 2,
      afferentCouplings: 1,
      efferentCouplings: 1,
      instability: 0.5,
    },
    {
      name: "src/foo/quuz",
      dependencies: [],
      dependents: [
        {
          name: "src/foo",
        },
      ],
      moduleCount: 1,
      afferentCouplings: 1,
      efferentCouplings: 0,
      instability: 0,
    },
  ],
  summary: {
    violations: [],
    error: 0,
    warn: 0,
    info: 0,
    ignore: 0,
    totalCruised: 30,
    totalDependenciesCruised: 38,
    optionsUsed: {
      combinedDependencies: false,
      externalModuleResolutionStrategy: "node_modules",
      includeOnly: "^src/report",
      moduleSystems: ["es6", "cjs", "tsd", "amd"],
      outputTo: "-",
      outputType: "json",
      preserveSymlinks: false,
      tsPreCompilationDeps: false,
      exoticRequireStrings: [],
      args: "src/report",
    },
  },
};
