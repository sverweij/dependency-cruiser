export default [
  {
    source: "src/tmp-cycle-2.js",
    dependencies: [
      {
        resolved: "src/tmp-cycle-3.js",
        coreModule: false,
        followable: true,
        couldNotResolve: false,
        dependencyTypes: ["local"],
        dynamic: false,
        module: "./tmp-cycle-3.js",
        moduleSystem: "cjs",
        exoticallyRequired: false,
        matchesDoNotFollow: false,
        circular: true,
        cycle: [
          "src/tmp-cycle-3.js",
          "src/tmp-cycle-1.js",
          "src/tmp-cycle-2.js",
        ],
        valid: false,
        rules: [
          {
            severity: "error",
            name: "no-circular",
          },
        ],
      },
    ],
    dependents: ["src/tmp-cycle-1.js"],
    orphan: false,
    valid: true,
  },
  {
    source: "src/tmp-cycle-3.js",
    dependencies: [
      {
        resolved: "src/tmp-cycle-1.js",
        coreModule: false,
        followable: true,
        couldNotResolve: false,
        dependencyTypes: ["local"],
        dynamic: false,
        module: "./tmp-cycle-1.js",
        moduleSystem: "cjs",
        exoticallyRequired: false,
        matchesDoNotFollow: false,
        circular: true,
        cycle: [
          "src/tmp-cycle-1.js",
          "src/tmp-cycle-2.js",
          "src/tmp-cycle-3.js",
        ],
        valid: false,
        rules: [
          {
            severity: "error",
            name: "no-circular",
          },
        ],
      },
    ],
    dependents: ["src/tmp-cycle-2.js"],
    orphan: false,
    valid: true,
  },
  {
    source: "src/tmp-cycle-1.js",
    dependencies: [
      {
        resolved: "src/tmp-cycle-2.js",
        coreModule: false,
        followable: true,
        couldNotResolve: false,
        dependencyTypes: ["local"],
        dynamic: false,
        module: "./tmp-cycle-2.js",
        moduleSystem: "cjs",
        exoticallyRequired: false,
        matchesDoNotFollow: false,
        circular: true,
        cycle: [
          "src/tmp-cycle-2.js",
          "src/tmp-cycle-3.js",
          "src/tmp-cycle-1.js",
        ],
        valid: false,
        rules: [
          {
            severity: "error",
            name: "no-circular",
          },
        ],
      },
    ],
    dependents: ["src/tmp-cycle-3.js"],
    orphan: false,
    valid: true,
  },
];
