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
      name: "src/report",
      dependencies: [],
      dependents: [],
      moduleCount: 30,
      afferentCouplings: 0,
      efferentCouplings: 0,
      instability: 0,
    },
    {
      name: "src/report/anon",
      dependencies: [],
      dependents: [
        {
          name: "src/report",
        },
      ],
      moduleCount: 4,
      afferentCouplings: 1,
      efferentCouplings: 0,
      instability: 0,
    },
    {
      name: "src/report/utl",
      dependencies: [],
      dependents: [
        {
          name: "src/report",
        },
        {
          name: "src/report/html",
        },
        {
          name: "src/report/dot",
        },
        {
          name: "src/report/error-html",
        },
      ],
      moduleCount: 2,
      afferentCouplings: 6,
      efferentCouplings: 0,
      instability: 0,
    },
    {
      name: "src/report/dot",
      dependencies: [
        {
          name: "src/report/utl",
          instability: 0,
          circular: false,
          valid: true,
        },
      ],
      dependents: [
        {
          name: "src/report",
        },
      ],
      moduleCount: 8,
      afferentCouplings: 1,
      efferentCouplings: 1,
      instability: 0.5,
    },
    {
      name: "src/report/error-html",
      dependencies: [
        {
          name: "src/report/utl",
          instability: 0,
          circular: false,
          valid: true,
        },
      ],
      dependents: [
        {
          name: "src/report",
        },
      ],
      moduleCount: 3,
      afferentCouplings: 1,
      efferentCouplings: 1,
      instability: 0.5,
    },
    {
      name: "src/report/html",
      dependencies: [
        {
          name: "src/report/utl",
          instability: 0,
          circular: false,
          valid: true,
        },
      ],
      dependents: [
        {
          name: "src/report",
        },
      ],
      moduleCount: 2,
      afferentCouplings: 1,
      efferentCouplings: 1,
      instability: 0.5,
    },
    {
      name: "src/report/plugins",
      dependencies: [],
      dependents: [
        {
          name: "src/report",
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
