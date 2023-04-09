import { expect } from "chai";
import softenKnownViolations from "../../src/enrich/soften-known-violations.mjs";

describe("[U] enrich/soften-known-violations - modules violations", () => {
  /** @type import("../../types/baseline-violations").IBaselineViolations */
  const lKnownModuleViolations = [
    {
      from: "./remi.js",
      to: "./remi.js",
      rule: {
        name: "no-orphans",
        severity: "error",
      },
    },
  ];

  it("no violations => no violations", () => {
    expect(softenKnownViolations([], lKnownModuleViolations)).to.deep.equal([]);
  });

  it("valid modules are kept alone", () => {
    /** @type import("../../types/cruise-result").IModule[] */
    const lModules = [
      { source: "alez-houpe.js", valid: true, dependencies: [] },
    ];

    expect(
      softenKnownViolations(lModules, lKnownModuleViolations)
    ).to.deep.equal(lModules);
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

    expect(
      softenKnownViolations(lModules, lKnownModuleViolations)
    ).to.deep.equal(lModules);
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

    expect(
      softenKnownViolations(lModules, lKnownModuleViolations)
    ).to.deep.equal(lSoftenedModules);
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

    expect(
      softenKnownViolations(lModules, lKnownModuleViolations, "info")
    ).to.deep.equal(lSoftenedModules);
  });
});

describe("[U] enrich/soften-known-violations - dependency violations", () => {
  /** @type import("../../types/baseline-violations").IBaselineViolations */
  const lKnownDependencyViolations = [
    {
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
    expect(softenKnownViolations([], lKnownDependencyViolations)).to.deep.equal(
      []
    );
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

    expect(
      softenKnownViolations(lModules, lKnownDependencyViolations)
    ).to.deep.equal(lModules);
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

    expect(
      softenKnownViolations(lModules, lKnownDependencyViolations)
    ).to.deep.equal(lModules);
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

    expect(
      softenKnownViolations(lModules, lKnownDependencyViolations)
    ).to.deep.equal(lModules);
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

    expect(
      softenKnownViolations(lModules, lKnownDependencyViolations)
    ).to.deep.equal(lSoftenedModules);
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

    expect(
      softenKnownViolations(lModules, lKnownDependencyViolations, "warn")
    ).to.deep.equal(lSoftenedModules);
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

    expect(
      softenKnownViolations(lModules, lKnownCyclicViolations, "info")
    ).to.deep.equal(lSoftenedModules);
  });

  it("also softens 'self-referencing' modules", () => {
    /** @type import("../../types/baseline-violations").IBaselineViolations */
    const lKnownSelfReferenceViolation = [
      {
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
    expect(
      softenKnownViolations(lModules, lKnownSelfReferenceViolation, "ignore")
    ).to.deep.equal(lSoftenedModules);
  });
});
