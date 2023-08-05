import { deepStrictEqual } from "node:assert";
import { describe, it } from "node:test";
import consolidateToPattern from "../../src/graph-utl/consolidate-to-pattern.mjs";

describe("[U] graph-utl/consolidateToPattern", () => {
  it("no pattern => no squashing", () => {
    const lInput = [
      {
        source: "some/folder/thing.js",
        rules: [],
        valid: true,
        dependencies: [],
      },
    ];
    const lOutput = [
      {
        source: "some/folder/thing.js",
        rules: [],
        valid: true,
        consolidated: false,
        dependencies: [],
      },
    ];

    deepStrictEqual(consolidateToPattern(lInput, "^$"), lOutput);
  });

  it("no match => no squashing", () => {
    const lInput = [
      {
        source: "some/folder/thing.js",
        rules: [],
        valid: true,
        dependencies: [],
      },
    ];
    const lOutput = [
      {
        source: "some/folder/thing.js",
        rules: [],
        valid: true,
        consolidated: false,
        dependencies: [],
      },
    ];

    deepStrictEqual(consolidateToPattern(lInput, "src/[^/]+"), lOutput);
  });

  it("source gets squashed to pattern", () => {
    const lInput = [
      {
        source: "some/folder/thing.js",
        rules: [],
        valid: true,
        dependencies: [],
      },
    ];
    const lOutput = [
      {
        source: "some",
        rules: [],
        valid: true,
        consolidated: true,
        dependencies: [],
      },
    ];

    deepStrictEqual(consolidateToPattern(lInput, "[^/]+"), lOutput);
  });

  it("dependencies' resolved names get squashed as well", () => {
    const lInput = [
      {
        source: "thing.js",
        rules: [],
        valid: true,
        dependencies: [
          {
            resolved: "some/folder/bla.js",
            rules: [],
            valid: true,
            dependencyTypes: ["cjs"],
          },
          {
            resolved: "bla.js",
            rules: [],
            valid: true,
            dependencyTypes: ["cjs"],
          },
        ],
      },
      {
        source: "some/folder/bla.js",
        rules: [],
        valid: true,
        dependencies: [],
      },
      {
        source: "bla.js",
        rules: [],
        valid: true,
        dependencies: [],
      },
    ];
    const lOutput = [
      {
        source: "thing.js",
        rules: [],
        valid: true,
        consolidated: false,
        dependencies: [
          {
            resolved: "some/folder",
            rules: [],
            valid: true,
            dependencyTypes: ["cjs"],
          },
          {
            resolved: "bla.js",
            rules: [],
            valid: true,
            dependencyTypes: ["cjs"],
          },
        ],
      },
      {
        source: "some/folder",
        rules: [],
        valid: true,
        consolidated: true,
        dependencies: [],
      },
      {
        source: "bla.js",
        rules: [],
        valid: true,
        consolidated: false,
        dependencies: [],
      },
    ];

    deepStrictEqual(consolidateToPattern(lInput, "[^/]+/[^/]+"), lOutput);
  });

  it("reconsolidation with the same pattern yields the same result", () => {
    const lInput = [
      {
        source: "thing.js",
        rules: [],
        valid: true,
        dependencies: [
          {
            resolved: "some/folder/bla.js",
            rules: [],
            valid: true,
            dependencyTypes: ["cjs"],
          },
          {
            resolved: "bla.js",
            rules: [],
            valid: true,
            dependencyTypes: ["cjs"],
          },
        ],
      },
      {
        source: "some/folder/bla.js",
        rules: [],
        valid: true,
        dependencies: [],
      },
      {
        source: "bla.js",
        rules: [],
        valid: true,
        dependencies: [],
      },
    ];
    const lOutput = [
      {
        source: "thing.js",
        rules: [],
        valid: true,
        consolidated: false,
        dependencies: [
          {
            resolved: "some/folder",
            rules: [],
            valid: true,
            dependencyTypes: ["cjs"],
          },
          {
            resolved: "bla.js",
            rules: [],
            valid: true,
            dependencyTypes: ["cjs"],
          },
        ],
      },
      {
        source: "some/folder",
        rules: [],
        valid: true,
        consolidated: true,
        dependencies: [],
      },
      {
        source: "bla.js",
        rules: [],
        valid: true,
        consolidated: false,
        dependencies: [],
      },
    ];

    const lConsolidated = consolidateToPattern(lInput, "[^/]+/[^/]+");
    deepStrictEqual(
      consolidateToPattern(lConsolidated, "[^/]+/[^/]+"),
      lOutput
    );
  });
});
