export default {
  modules: [],
  summary: {
    violations: [
      {
        type: "dependency",
        from: "src/index.mjs",
        to: "node_modules/snodash/index.js",
        unresolvedTo: "snodash",
        dependencyTypes: ["npm"],
        rule: {
          severity: "error",
          name: "no-external",
        },
      },
      {
        type: "dependency",
        from: "src/index.mjs",
        to: "src/utils/main.cjs",
        unresolvedTo: "#utils",
        dependencyTypes: ["aliased"],
        rule: {
          severity: "warn",
          name: "no-aliased",
        },
      },
    ],
    error: 1,
    warn: 1,
    info: 0,
    totalCruised: 5,
    totalDependenciesCruised: 10,
    ruleSetUsed: {
      forbidden: [
        {
          name: "no-external",
          from: {},
          to: { dependencyTypes: ["npm"] },
        },
        {
          name: "no-aliased",
          from: {},
          to: { dependencyTypes: ["aliased"] },
        },
      ],
    },
  },
};
