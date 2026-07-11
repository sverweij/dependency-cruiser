export default {
  modules: [],
  summary: {
    violations: [
      {
        type: "dependency",
        from: "aap",
        to: "noot",
        rule: {
          name: "no-leesplank",
          severity: "warn",
        },
      },
    ],
    error: 0,
    warn: 1,
    info: 0,
    totalCruised: 0,
    totalDependenciesCruised: 0,
    optionsUsed: {
      outputTo: "not-very-relevant",
      exclude: { path: "" },
      moduleSystems: ["amd", "cjs", "es6"],
      outputType: "json",
    },
    environment: {
      version: "481",
      nodeVersionSupported: "^42",
      nodeVersionFound: "42.1.2",
      osVersionFound: `riscv pinecil@1.2.3`,
      transpilersFound: [],
      extensionsFound: [],
      issues: [
        {
          severity: "error",
          name: "environment-issue-name",
          description: "Hoor, wie klopt daar kind'ren.",
        },
      ],
    },
  },
};
