export default {
  modules: [
    {
      source: "remi.js",
      dependencies: [],
      orphan: true,
      valid: false,
      rules: [
        {
          severity: "error",
          name: "no-orphans",
        },
      ],
    },
  ],
  summary: {
    violations: [
      {
        type: "module",
        from: "remi.js",
        to: "remi.js",
        rule: {
          severity: "error",
          name: "no-orphans",
        },
      },
    ],
    error: 1,
    warn: 0,
    info: 0,
    totalCruised: 1,
    totalDependenciesCruised: 0,
    optionsUsed: {
      rulesFile: ".dependency-cruiser-custom.json",
      outputTo: "-",
      doNotFollow: "^node_modules",
      exclude: "fixtures",
      moduleSystems: ["amd", "cjs", "es6"],
      outputType: "json",
      tsPreCompilationDeps: false,
      preserveSymlinks: false,
    },
  },
};
