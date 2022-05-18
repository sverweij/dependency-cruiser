export default {
  modules: [
    {
      source: "src/some/folder/nested/center.js",
      dependencies: [
        {
          resolved: "src/some/folder/loop-a.js",
          coreModule: false,
          followable: false,
          couldNotResolve: false,
          dependencyTypes: [],
          dynamic: false,
          module: "../loop-a",
          moduleSystem: "es6",
          valid: true,
          cycle: [
            "src/some/folder/loop-a.js",
            "src/some/folder/loop-b.js",
            "src/some/folder/nested/center.js",
          ],
          rules: [
            {
              severity: "error",
              name: "no-circular",
            },
          ],
        },
      ],
      valid: true,
    },
    {
      source: "src/some/folder/loop-a.js",
      dependencies: [
        {
          resolved: "src/some/folder/loop-b.js",
          coreModule: false,
          followable: false,
          couldNotResolve: false,
          dependencyTypes: [],
          dynamic: false,
          module: "./loop-b",
          moduleSystem: "es6",
          valid: true,
          cycle: [
            "src/some/folder/loop-b.js",
            "src/some/folder/nested/center.js",
            "src/some/folder/loop-a.js",
          ],
          rules: [
            {
              severity: "error",
              name: "no-circular",
            },
          ],
        },
      ],
      valid: true,
    },
    {
      source: "src/some/folder/loop-b.js",
      dependencies: [
        {
          resolved: "src/some/folder/nested/center.js",
          coreModule: false,
          followable: false,
          couldNotResolve: false,
          dependencyTypes: [],
          dynamic: false,
          module: "./nested/center",
          moduleSystem: "es6",
          valid: false,
          cycle: [
            "src/some/folder/nested/center.js",
            "src/some/folder/loop-a.js",
            "src/some/folder/loop-b.js",
          ],
          rules: [
            {
              severity: "error",
              name: "no-circular",
            },
          ],
        },
      ],
      valid: true,
    },
  ],
  summary: {
    violations: [
      {
        type: "cycle",
        from: "src/some/folder/nested/center.js",
        to: "src/some/folder/loop-a.js",
        rule: {
          severity: "error",
          name: "no-circular",
        },
        cycle: [
          "src/some/folder/loop-a.js",
          "src/some/folder/loop-b.js",
          "src/some/folder/nested/center.js",
        ],
      },
      {
        type: "cycle",
        from: "src/some/folder/loop-a.js",
        to: "src/some/folder/loop-b.js",
        rule: {
          severity: "error",
          name: "no-circular",
        },
        cycle: [
          "src/some/folder/loop-b.js",
          "src/some/folder/nested/center.js",
          "src/some/folder/loop-a.js",
        ],
      },
      {
        type: "cycle",
        from: "src/some/folder/loop-b.js",
        to: "src/some/folder/nested/center.js",
        rule: {
          severity: "error",
          name: "no-circular",
        },
        cycle: [
          "src/some/folder/nested/center.js",
          "src/some/folder/loop-a.js",
          "src/some/folder/loop-b.js",
        ],
      },
    ],
    error: 3,
    warn: 0,
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
          name: "no-circular",
          comment:
            "This dependency is part of a circular relationship. You might want to revise your solution (i.e. use dependency inversion, make sure the modules have a single responsibility) ",
          severity: "error",
          from: {},
          to: {
            circular: true,
          },
        },
      ],
    },
  },
};
