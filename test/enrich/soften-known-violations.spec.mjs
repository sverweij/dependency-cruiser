import { deepEqual } from "node:assert/strict";
import softenKnownViolations from "#enrich/soften-known-violations.mjs";

describe("[U] enrich/soften-known-violations - modules violations", () => {
  /** @type import("../../types/baseline-violations").IBaselineViolations */
  const lKnownModuleViolations = [
    {
      type: "module",
      from: "./remi.js",
      to: "./remi.js",
      rule: {
        name: "no-orphans",
        severity: "error",
      },
    },
  ];

  it("no violations => no violations", () => {
    deepEqual(softenKnownViolations([], lKnownModuleViolations), []);
  });

  it("valid modules are kept alone", () => {
    /** @type import("../../types/cruise-result").IModule[] */
    const lModules = [
      { source: "alez-houpe.js", valid: true, dependencies: [] },
    ];

    deepEqual(
      softenKnownViolations(lModules, lKnownModuleViolations),
      lModules,
    );
  });

  it("invalid modules that are not in known violations are kept alone", () => {
    /** @type import("../../types/cruise-result").IModule[] */
    const lModules = [
      {
        source: "alez-houpe.js",
        valid: false,
        rules: [{ name: "no-orphans", severity: "error" }],
        dependencies: [],
      },
    ];

    deepEqual(
      softenKnownViolations(lModules, lKnownModuleViolations),
      lModules,
    );
  });

  it("invalid modules that are in known violations are softened (default to 'ignore')", () => {
    /** @type import("../../types/cruise-result").IModule[] */
    const lModules = [
      {
        source: "./remi.js",
        valid: false,
        rules: [{ name: "no-orphans", severity: "error" }],
        dependencies: [],
      },
    ];

    const lSoftenedModules = [
      {
        source: "./remi.js",
        valid: false,
        rules: [{ name: "no-orphans", severity: "ignore" }],
        dependencies: [],
      },
    ];

    deepEqual(
      softenKnownViolations(lModules, lKnownModuleViolations),
      lSoftenedModules,
    );
  });

  it("invalid modules that are in known violations are softened (to the specified level)", () => {
    /** @type import("../../types/cruise-result").IModule[] */
    const lModules = [
      {
        source: "./remi.js",
        valid: false,
        rules: [{ name: "no-orphans", severity: "error" }],
        dependencies: [],
      },
    ];

    const lSoftenedModules = [
      {
        source: "./remi.js",
        valid: false,
        rules: [{ name: "no-orphans", severity: "info" }],
        dependencies: [],
      },
    ];

    deepEqual(
      softenKnownViolations(lModules, lKnownModuleViolations, "info"),
      lSoftenedModules,
    );
  });
});

describe("[U] enrich/soften-known-violations - reachability violations", () => {
  /** @type import("../../types/baseline-violations").IBaselineViolations */
  const lKnownReachabilityViolations = [
    {
      type: "reachability",
      from: "src/app/layout.tsx",
      to: "node_modules/.pnpm/lodash@4.17.21/node_modules/lodash/noop.js",
      rule: {
        severity: "error",
        name: "no-disallowed-dependency-in-root-layout",
      },
      via: [
        {
          name: "src/app/providers.tsx",
          dependencyTypes: ["local", "import"],
        },
        {
          name: "src/context/theme-context.tsx",
          dependencyTypes: ["local", "import"],
        },
        {
          name: "node_modules/.pnpm/lodash@4.17.21/node_modules/lodash/noop.js",
          dependencyTypes: ["npm", "import"],
        },
      ],
    },
  ];
  it("no violations => no violations", () => {
    deepEqual(softenKnownViolations([], lKnownReachabilityViolations), []);
  });
  it("valid modules are kept alone", () => {
    /** @type import("../../types/cruise-result").IModule[] */
    const lModules = [
      { source: "alez-houpe.js", valid: true, dependencies: [] },
    ];

    deepEqual(
      softenKnownViolations(lModules, lKnownReachabilityViolations),
      lModules,
    );
  });
  it("invalid modules that are not in known violations are kept alone", () => {
    /** @type import("../../types/cruise-result").IModule[] */
    const lModules = [
      {
        source: "alez-houpe.js",
        valid: false,
        rules: [{ name: "no-orphans", severity: "error" }],
        dependencies: [],
      },
    ];

    deepEqual(
      softenKnownViolations(lModules, lKnownReachabilityViolations),
      lModules,
    );
  });
  it("invalid modules that are in known violations are softened (default to 'ignore')", () => {
    /** @type import("../../types/cruise-result").IModule[] */
    const lModules = [
      {
        source: "src/app/layout.tsx",
        valid: false,
        rules: [
          {
            name: "no-disallowed-dependency-in-root-layout",
            severity: "error",
          },
        ],
        dependencies: [],
      },
    ];

    const lSoftenedModules = [
      {
        source: "src/app/layout.tsx",
        valid: false,
        rules: [
          {
            name: "no-disallowed-dependency-in-root-layout",
            severity: "ignore",
          },
        ],
        dependencies: [],
      },
    ];

    deepEqual(
      softenKnownViolations(lModules, lKnownReachabilityViolations),
      lSoftenedModules,
    );
  });
});

describe("[U] enrich/soften-known-violations - module dependency instability violations", () => {
  /** @type import("../../types/baseline-violations").IBaselineViolations */
  const lKnownInstabilityViolations = [
    {
      type: "instability",
      from: "src/cache/content-strategy.mjs",
      to: "src/cache/find-content-changes.mjs",
      rule: {
        severity: "info",
        name: "SDP",
      },
      metrics: {
        from: {
          instability: 0.6666666666666666,
        },
        to: {
          instability: 0.75,
        },
      },
    },
  ];

  it("invalid modules dependencies that are in known violations are softened (default to 'ignore')", () => {
    /** @type import("../../types/cruise-result").IModule[] */
    const lModules = [
      {
        source: "src/cache/content-strategy.mjs",
        valid: true,
        dependencies: [
          {
            resolved: "src/cache/find-content-changes.mjs",
            valid: false,
            rules: [{ name: "SDP", severity: "info" }],
          },
        ],
      },
    ];

    const lSoftenedModules = [
      {
        source: "src/cache/content-strategy.mjs",
        valid: true,
        dependencies: [
          {
            resolved: "src/cache/find-content-changes.mjs",
            valid: false,
            rules: [{ name: "SDP", severity: "ignore" }],
          },
        ],
      },
    ];

    deepEqual(
      softenKnownViolations(lModules, lKnownInstabilityViolations),
      lSoftenedModules,
    );
  });
});

describe("[U] enrich/soften-known-violations - dependency violations", () => {
  /** @type import("../../types/baseline-violations").IBaselineViolations */
  const lKnownDependencyViolations = [
    {
      type: "dependency",
      from: "./from.js",
      to: "./forbidden-fruit/apple.js",
      rule: {
        name: "not-to-forbidden-fruit",
        severity: "error",
      },
    },
  ];
  const lKnownCyclicViolations = [
    {
      type: "cycle",
      from: "./cycle-1.js",
      to: "./cycle-2.js",
      rule: {
        name: "no-cycles",
        severity: "info",
      },
      cycle: ["./cycle-2.js", "./cycle-3.js", "./cycle-1.js"],
    },
  ];

  it("no violations => no violations", () => {
    deepEqual(softenKnownViolations([], lKnownDependencyViolations), []);
  });

  it("valid dependencies are left alone", () => {
    /** @type import("../../types/cruise-result").IModule[] */
    const lModules = [
      {
        source: "./from.js",
        valid: true,
        dependencies: [
          {
            resolved: "./allowed-fruit/ada.mjs",
            valid: true,
          },
        ],
      },
    ];

    deepEqual(
      softenKnownViolations(lModules, lKnownDependencyViolations),
      lModules,
    );
  });

  it("invalid dependencies that are not in known violations are left alone (violation not in unknown)", () => {
    /** @type import("../../types/cruise-result").IModule[] */
    const lModules = [
      {
        source: "./from.js",
        valid: true,
        dependencies: [
          {
            resolved: "./rotten-fruit/mispel.mjs",
            valid: false,
            rules: [{ name: "not-to-rotten-fruit", severity: "error" }],
          },
        ],
      },
    ];

    deepEqual(
      softenKnownViolations(lModules, lKnownDependencyViolations),
      lModules,
    );
  });

  it("invalid dependencies that are not in known violations are left alone (dependency not in unknown)", () => {
    /** @type import("../../types/cruise-result").IModule[] */
    const lModules = [
      {
        source: "./from.js",
        valid: true,
        dependencies: [
          {
            resolved: "./forbidden-fruit/golden-delicious.mjs",
            valid: false,
            rules: [{ name: "not-to-forbidden-fruit", severity: "error" }],
          },
        ],
      },
    ];

    deepEqual(
      softenKnownViolations(lModules, lKnownDependencyViolations),
      lModules,
    );
  });

  it("invalid dependencies that are in known violations are softened (default to 'ignore')", () => {
    /** @type import("../../types/cruise-result").IModule[] */
    const lModules = [
      {
        source: "./from.js",
        valid: true,
        dependencies: [
          {
            resolved: "./forbidden-fruit/apple.js",
            valid: false,
            rules: [{ name: "not-to-forbidden-fruit", severity: "error" }],
          },
        ],
      },
    ];

    const lSoftenedModules = [
      {
        source: "./from.js",
        valid: true,
        dependencies: [
          {
            resolved: "./forbidden-fruit/apple.js",
            valid: false,
            rules: [{ name: "not-to-forbidden-fruit", severity: "ignore" }],
          },
        ],
      },
    ];

    deepEqual(
      softenKnownViolations(lModules, lKnownDependencyViolations),
      lSoftenedModules,
    );
  });

  it("invalid dependencies that are in known violations are softened (to the specified level)", () => {
    /** @type import("../../types/cruise-result").IModule[] */
    const lModules = [
      {
        source: "./from.js",
        valid: true,
        dependencies: [
          {
            resolved: "./forbidden-fruit/apple.js",
            valid: false,
            rules: [{ name: "not-to-forbidden-fruit", severity: "error" }],
          },
        ],
      },
    ];

    const lSoftenedModules = [
      {
        source: "./from.js",
        valid: true,
        dependencies: [
          {
            resolved: "./forbidden-fruit/apple.js",
            valid: false,
            rules: [{ name: "not-to-forbidden-fruit", severity: "warn" }],
          },
        ],
      },
    ];

    deepEqual(
      softenKnownViolations(lModules, lKnownDependencyViolations, "warn"),
      lSoftenedModules,
    );
  });

  it("invalid circular dependencies that are in known violations are softened (to the specified level)", () => {
    /** @type import("../../types/cruise-result").IModule[] */
    const lModules = [
      {
        source: "./cycle-1.js",
        valid: true,
        dependencies: [
          {
            resolved: "cycle-2.js",
            module: "./cycle-2",
            valid: false,
            circular: true,
            rules: [{ name: "no-cycles", severity: "error" }],
            cycle: ["./cycle-2.js", "./cycle-3.js", "./cycle-1.js"],
          },
        ],
      },
      {
        source: "./cycle-2.js",
        valid: true,
        dependencies: [
          {
            resolved: "cycle-3.js",
            module: "./cycle-3",
            valid: false,
            circular: true,
            rules: [{ name: "no-cycles", severity: "error" }],
            cycle: ["./cycle-3.js", "./cycle-1.js", "./cycle-2.js"],
          },
        ],
      },
      {
        source: "./cycle-3.js",
        valid: true,
        dependencies: [
          {
            resolved: "cycle-1.js",
            module: "./cycle-1",
            valid: false,
            circular: true,
            rules: [{ name: "no-cycles", severity: "error" }],
            cycle: ["./cycle-1.js", "./cycle-2.js", "./cycle-3.js"],
          },
        ],
      },
    ];

    const lSoftenedModules = [
      {
        source: "./cycle-1.js",
        valid: true,
        dependencies: [
          {
            resolved: "cycle-2.js",
            module: "./cycle-2",
            valid: false,
            circular: true,
            rules: [{ name: "no-cycles", severity: "info" }],
            cycle: ["./cycle-2.js", "./cycle-3.js", "./cycle-1.js"],
          },
        ],
      },
      {
        source: "./cycle-2.js",
        valid: true,
        dependencies: [
          {
            resolved: "cycle-3.js",
            module: "./cycle-3",
            valid: false,
            circular: true,
            rules: [{ name: "no-cycles", severity: "info" }],
            cycle: ["./cycle-3.js", "./cycle-1.js", "./cycle-2.js"],
          },
        ],
      },
      {
        source: "./cycle-3.js",
        valid: true,
        dependencies: [
          {
            resolved: "cycle-1.js",
            module: "./cycle-1",
            valid: false,
            circular: true,
            rules: [{ name: "no-cycles", severity: "info" }],
            cycle: ["./cycle-1.js", "./cycle-2.js", "./cycle-3.js"],
          },
        ],
      },
    ];

    deepEqual(
      softenKnownViolations(lModules, lKnownCyclicViolations, "info"),
      lSoftenedModules,
    );
  });

  it("also softens 'self-referencing' modules", () => {
    /** @type import("../../types/baseline-violations").IBaselineViolations */
    const lKnownSelfReferenceViolation = [
      {
        type: "cycle",
        from: "packages/react-dom/src/events/forks/EventListener-www.js",
        to: "packages/react-dom/src/events/forks/EventListener-www.js",
        rule: {
          severity: "warn",
          name: "no-circular",
        },
        cycle: [
          "packages/react-dom/src/events/forks/EventListener-www.js",
          "packages/react-dom/src/events/forks/EventListener-www.js",
        ],
      },
    ];

    const lModules = [
      {
        source: "packages/react-dom/src/events/forks/EventListener-www.js",
        dependencies: [
          {
            module: "../EventListener",
            moduleSystem: "es6",
            dynamic: false,
            exoticallyRequired: false,
            resolved: "packages/react-dom/src/events/EventListener.js",
            coreModule: false,
            followable: true,
            couldNotResolve: false,
            dependencyTypes: ["local"],
            matchesDoNotFollow: false,
            circular: false,
            valid: true,
          },
          {
            module: "./EventListener-www",
            moduleSystem: "es6",
            dynamic: false,
            exoticallyRequired: false,
            resolved:
              "packages/react-dom/src/events/forks/EventListener-www.js",
            coreModule: false,
            followable: true,
            couldNotResolve: false,
            dependencyTypes: ["local"],
            matchesDoNotFollow: false,
            circular: true,
            cycle: [
              "packages/react-dom/src/events/forks/EventListener-www.js",
              "packages/react-dom/src/events/forks/EventListener-www.js",
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
    const lSoftenedModules = [
      {
        source: "packages/react-dom/src/events/forks/EventListener-www.js",
        dependencies: [
          {
            module: "../EventListener",
            moduleSystem: "es6",
            dynamic: false,
            exoticallyRequired: false,
            resolved: "packages/react-dom/src/events/EventListener.js",
            coreModule: false,
            followable: true,
            couldNotResolve: false,
            dependencyTypes: ["local"],
            matchesDoNotFollow: false,
            circular: false,
            valid: true,
          },
          {
            module: "./EventListener-www",
            moduleSystem: "es6",
            dynamic: false,
            exoticallyRequired: false,
            resolved:
              "packages/react-dom/src/events/forks/EventListener-www.js",
            coreModule: false,
            followable: true,
            couldNotResolve: false,
            dependencyTypes: ["local"],
            matchesDoNotFollow: false,
            circular: true,
            cycle: [
              "packages/react-dom/src/events/forks/EventListener-www.js",
              "packages/react-dom/src/events/forks/EventListener-www.js",
            ],
            valid: false,
            rules: [
              {
                severity: "ignore",
                name: "no-circular",
              },
            ],
          },
        ],
        orphan: false,
        valid: true,
      },
    ];
    deepEqual(
      softenKnownViolations(lModules, lKnownSelfReferenceViolation, "ignore"),
      lSoftenedModules,
    );
  });
});
