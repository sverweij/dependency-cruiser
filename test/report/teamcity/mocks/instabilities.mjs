export default {
  modules: [
    {
      source: "src/more-stable.js",
      instability: 0.42,
      dependencies: [
        {
          resolved: "src/less-stable.js",
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
      source: "src/less-stable.js",
      instability: 1,
      dependencies: [],
      dependents: ["src/more-stable.js"],
      valid: true,
    },
  ],
  summary: {
    violations: [
      {
        type: "instability",
        from: "src/more-stable.js",
        to: "src/less-stable.js",
        rule: {
          severity: "warn",
          name: "sdp",
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
