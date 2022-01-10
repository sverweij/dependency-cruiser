export default {
  modules: [
    {
      source: "a.js",
      instability: 0.42,
      dependencies: [
        {
          resolved: "b.js",
          instability: 1,
          coreModule: false,
          followable: false,
          couldNotResolve: false,
          dependencyTypes: [],
          dynamic: false,
          module: "./less-stable.js",
          moduleSystem: "es6",
          valid: false,
          rules: [
            {
              severity: "warn",
              name: "sdp",
            },
          ],
        },
      ],
      valid: true,
    },
    {
      source: "b.js",
      instability: 1,
      dependencies: [],
      dependents: ["a.js"],
      valid: true,
    },
  ],
  summary: {
    violations: [
      {
        // type: "instability",
        from: "a.js",
        to: "b.js",
        rule: {
          severity: "warn",
          name: "missing-type",
        },
        metrics: {
          from: {
            instability: 0.42,
          },
          to: {
            instability: 1,
          },
        },
      },
    ],
    error: 0,
    warn: 1,
    info: 0,
    totalCruised: 3,
    totalDependenciesCruised: 3,
    optionsUsed: {
      rulesFile: ".dependency-cruiser-custom.json",
      moduleSystems: ["amd", "cjs", "es6"],
      outputType: "json",
      tsPreCompilationDeps: false,
      preserveSymlinks: false,
    },
    ruleSetUsed: {
      forbidden: [
        {
          name: "sdp",
          severity: "warn",
          from: {},
          to: {
            moreUnstable: true,
          },
        },
      ],
    },
  },
};
