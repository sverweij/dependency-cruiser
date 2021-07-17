export default [
  {
    source: "node_modules/safe-regex/index.js",
    followable: false,
    coreModule: false,
    couldNotResolve: false,
    matchesDoNotFollow: true,
    dependencyTypes: ["npm"],
    dependencies: [],
    incidences: [
      {
        to: "node_modules/safe-regex/index.js",
        incidence: "false",
      },
      {
        to: "src/main/options/defaults.json",
        incidence: "false",
      },
      {
        to: "src/main/options/normalize.js",
        incidence: "false",
      },
      {
        to: "src/main/options/validate.js",
        incidence: "false",
      },
    ],
  },
  {
    source: "src/main/options/defaults.json",
    followable: false,
    coreModule: false,
    couldNotResolve: false,
    matchesDoNotFollow: false,
    dependencyTypes: ["local"],
    dependencies: [],
    incidences: [
      {
        to: "node_modules/safe-regex/index.js",
        incidence: "false",
      },
      {
        to: "src/main/options/defaults.json",
        incidence: "false",
      },
      {
        to: "src/main/options/normalize.js",
        incidence: "false",
      },
      {
        to: "src/main/options/validate.js",
        incidence: "false",
      },
    ],
  },
  {
    source: "src/main/options/normalize.js",
    dependencies: [
      {
        resolved: "src/main/options/defaults.json",
        coreModule: false,
        followable: false,
        couldNotResolve: false,
        dependencyTypes: ["local"],
        module: "./defaults.json",
        moduleSystem: "cjs",
        matchesDoNotFollow: false,
        circular: false,
        valid: false,
        rules: [
          {
            severity: "warn",
            name: "everything-to-defaults-is-a-violation",
          },
          {
            severity: "info",
            name: "everything-is-a-violation",
          },
        ],
      },
    ],
    incidences: [
      {
        to: "node_modules/safe-regex/index.js",
        incidence: "false",
      },
      {
        to: "src/main/options/defaults.json",
        incidence: "warn",
        rule: "everything-to-defaults-is-a-violation (+1 others)",
      },
      {
        to: "src/main/options/normalize.js",
        incidence: "false",
      },
      {
        to: "src/main/options/validate.js",
        incidence: "false",
      },
    ],
  },
  {
    source: "src/main/options/validate.js",
    dependencies: [
      {
        resolved: "node_modules/safe-regex/index.js",
        coreModule: false,
        followable: false,
        couldNotResolve: false,
        dependencyTypes: ["npm"],
        license: "MIT",
        module: "safe-regex",
        moduleSystem: "cjs",
        matchesDoNotFollow: true,
        circular: false,
        valid: false,
        rules: [
          {
            severity: "info",
            name: "everything-is-a-violation",
          },
        ],
      },
    ],
    incidences: [
      {
        to: "node_modules/safe-regex/index.js",
        incidence: "info",
        rule: "everything-is-a-violation",
      },
      {
        to: "src/main/options/defaults.json",
        incidence: "false",
      },
      {
        to: "src/main/options/normalize.js",
        incidence: "false",
      },
      {
        to: "src/main/options/validate.js",
        incidence: "false",
      },
    ],
  },
];
