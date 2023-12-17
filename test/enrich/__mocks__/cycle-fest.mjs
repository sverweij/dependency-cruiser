export default [
  {
    source: "src/brand.js",
    dependencies: [
      {
        resolved: "src/domain.js",
        coreModule: false,
        followable: true,
        couldNotResolve: false,
        dependencyTypes: ["local"],
        module: "./domain",
        moduleSystem: "cjs",
        dynamic: false,
        exoticallyRequired: false,
        matchesDoNotFollow: false,
        circular: true,
        cycle: [
          { name: "src/domain.js", dependencyTypes: ["local"] },
          { name: "src/market.js", dependencyTypes: ["local"] },
          { name: "src/brand.js", dependencyTypes: ["local"] },
        ],
        valid: false,
        rules: [
          {
            severity: "warn",
            name: "no-circular",
          },
        ],
      },
      {
        resolved: "src/market.js",
        coreModule: false,
        followable: true,
        couldNotResolve: false,
        dependencyTypes: ["local"],
        module: "./market",
        moduleSystem: "cjs",
        dynamic: false,
        exoticallyRequired: false,
        matchesDoNotFollow: false,
        circular: true,
        cycle: [
          { name: "src/market.js", dependencyTypes: ["local"] },
          { name: "src/brand.js", dependencyTypes: ["local"] },
        ],
        valid: false,
        rules: [
          {
            severity: "warn",
            name: "no-circular",
          },
        ],
      },
    ],
    orphan: false,
    valid: true,
  },
  {
    source: "src/domain.js",
    dependencies: [
      {
        resolved: "src/market.js",
        coreModule: false,
        followable: true,
        couldNotResolve: false,
        dependencyTypes: ["local"],
        module: "./market",
        moduleSystem: "cjs",
        dynamic: false,
        exoticallyRequired: false,
        matchesDoNotFollow: false,
        circular: true,
        cycle: [
          { name: "src/market.js", dependencyTypes: ["local"] },
          { name: "src/domain.js", dependencyTypes: ["local"] },
        ],
        valid: false,
        rules: [
          {
            severity: "warn",
            name: "no-circular",
          },
        ],
      },
    ],
    orphan: false,
    valid: true,
  },
  {
    source: "src/market.js",
    dependencies: [
      {
        resolved: "src/brand.js",
        coreModule: false,
        followable: true,
        couldNotResolve: false,
        dependencyTypes: ["local"],
        module: "./brand",
        moduleSystem: "cjs",
        dynamic: false,
        exoticallyRequired: false,
        matchesDoNotFollow: false,
        circular: true,
        cycle: [
          { name: "src/brand.js", dependencyTypes: ["local"] },
          { name: "src/market.js", dependencyTypes: ["local"] },
        ],
        valid: false,
        rules: [
          {
            severity: "warn",
            name: "no-circular",
          },
        ],
      },
      {
        resolved: "src/domain.js",
        coreModule: false,
        followable: true,
        couldNotResolve: false,
        dependencyTypes: ["local"],
        module: "./domain",
        moduleSystem: "cjs",
        dynamic: false,
        exoticallyRequired: false,
        matchesDoNotFollow: false,
        circular: true,
        cycle: [
          { name: "src/domain.js", dependencyTypes: ["local"] },
          { name: "src/market.js", dependencyTypes: ["local"] },
        ],
        valid: false,
        rules: [
          {
            severity: "warn",
            name: "no-circular",
          },
        ],
      },
    ],
    orphan: false,
    valid: true,
  },
];
