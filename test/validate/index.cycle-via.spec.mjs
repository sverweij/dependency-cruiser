import { deepEqual } from "node:assert/strict";
import parseRuleSet from "./parse-ruleset.utl.mjs";
import validate from "#validate/index.mjs";

function stringToCycleEntry(pString) {
  return {
    name: pString,
    dependencyTypes: [],
  };
}

describe("[I] validate/index dependency - cycle via", () => {
  const lCycleViaRuleSet = parseRuleSet({
    forbidden: [
      {
        from: {},
        to: {
          circular: true,
          via: { path: "^tmp/ab\\.js$" },
        },
      },
    ],
  });

  it("a => ba => bb => bc => a doesn't get flagged when none of them is in a via", () => {
    deepEqual(
      validate.dependency(
        lCycleViaRuleSet,
        { source: "tmp/a.js" },
        {
          resolved: "tmp/ba.js",
          circular: true,
          cycle: ["tmp/ba.js", "tmp/bb.js", "tmp/bc.js", "tmp/a.js"].map(
            stringToCycleEntry,
          ),
        },
      ),
      {
        valid: true,
      },
    );
  });

  it("a => aa => ab => ac => a get flagged when one of them is in a via", () => {
    deepEqual(
      validate.dependency(
        lCycleViaRuleSet,
        { source: "tmp/a.js" },
        {
          resolved: "tmp/aa.js",
          circular: true,
          cycle: ["tmp/aa.js", "tmp/ab.js", "tmp/ac.js", "tmp/a.js"].map(
            stringToCycleEntry,
          ),
        },
      ),
      {
        valid: false,
        rules: [{ name: "unnamed", severity: "warn" }],
      },
    );
  });

  it("a => aa => ab => ac => a get flagged when all of them are in a via", () => {
    const lRuleSet = parseRuleSet({
      forbidden: [
        {
          from: {},
          to: {
            circular: true,
            via: "^tmp/[^.]+[.]js$",
          },
        },
      ],
    });
    deepEqual(
      validate.dependency(
        lRuleSet,
        { source: "tmp/a.js" },
        {
          resolved: "tmp/aa.js",
          circular: true,
          cycle: ["tmp/aa.js", "tmp/ab.js", "tmp/ac.js", "tmp/a.js"].map(
            stringToCycleEntry,
          ),
        },
      ),
      {
        valid: false,
        rules: [{ name: "unnamed", severity: "warn" }],
      },
    );
  });

  it("a => aa => ab => ac => a get flagged when some of their dependencyTypes are of certain types", () => {
    const lRuleSet = parseRuleSet({
      forbidden: [
        {
          name: "no-circular-1",
          from: {},
          to: {
            circular: true,
            via: {
              dependencyTypes: ["require"],
            },
          },
        },
        {
          name: "no-circular-2",
          from: {},
          to: {
            circular: true,
            via: {
              dependencyTypes: ["import"],
            },
          },
        },
        {
          name: "no-circular-3",
          from: {},
          to: {
            circular: true,
            via: {
              dependencyTypes: ["import", "require", "local"],
            },
          },
        },
        {
          name: "no-circular-4",
          from: {},
          to: {
            circular: true,
            via: {
              dependencyTypes: ["type-only", "type-import"],
            },
          },
        },
      ],
    });
    deepEqual(
      validate.dependency(
        lRuleSet,
        { source: "tmp/a.js" },
        {
          resolved: "tmp/aa.js",
          circular: true,
          cycle: [
            { name: "tmp/aa.js", dependencyTypes: ["import"] },
            { name: "tmp/ab.js", dependencyTypes: ["import"] },
            { name: "tmp/ac.js", dependencyTypes: ["require"] },
            { name: "tmp/a.js", dependencyTypes: ["import"] },
          ],
        },
      ),
      {
        valid: false,
        rules: [
          { name: "no-circular-1", severity: "warn" },
          { name: "no-circular-2", severity: "warn" },
          { name: "no-circular-3", severity: "warn" },
        ],
      },
    );
  });
  it("a => aa => ab => ac => a get flagged when some of their dependencyTypes are NOT of certain types", () => {
    const lRuleSet = parseRuleSet({
      forbidden: [
        {
          name: "no-circular-1",
          from: {},
          to: {
            circular: true,
            via: {
              dependencyTypesNot: ["require"],
            },
          },
        },
        {
          name: "no-circular-2",
          from: {},
          to: {
            circular: true,
            via: {
              dependencyTypesNot: ["import"],
            },
          },
        },
        {
          name: "no-circular-3",
          from: {},
          to: {
            circular: true,
            via: {
              dependencyTypesNot: ["import", "require", "local"],
            },
          },
        },
        {
          name: "no-circular-4",
          from: {},
          to: {
            circular: true,
            via: {
              dependencyTypesNot: ["type-only", "type-import"],
            },
          },
        },
      ],
    });
    deepEqual(
      validate.dependency(
        lRuleSet,
        { source: "tmp/a.js" },
        {
          resolved: "tmp/aa.js",
          circular: true,
          cycle: [
            { name: "tmp/aa.js", dependencyTypes: ["import"] },
            { name: "tmp/ab.js", dependencyTypes: ["import"] },
            { name: "tmp/ac.js", dependencyTypes: ["require"] },
            { name: "tmp/a.js", dependencyTypes: ["import"] },
          ],
        },
      ),
      {
        valid: false,
        rules: [
          { name: "no-circular-1", severity: "warn" },
          { name: "no-circular-2", severity: "warn" },
          { name: "no-circular-4", severity: "warn" },
        ],
      },
    );
  });
});

describe("[I] validate/index dependency - cycle via - with group matching", () => {
  const lCycleViaRuleSet = parseRuleSet({
    forbidden: [
      {
        from: {
          path: "^([^/]+)",
        },
        to: {
          circular: true,
          via: { path: "^$1/ab\\.js$" },
        },
      },
    ],
  });

  it("a => ba => bb => bc => a doesn't get flagged when none of them is in a via", () => {
    deepEqual(
      validate.dependency(
        lCycleViaRuleSet,
        { source: "tmp/a.js" },
        {
          resolved: "tmp/ba.js",
          circular: true,
          cycle: ["tmp/ba.js", "tmp/bb.js", "tmp/bc.js", "tmp/a.js"].map(
            stringToCycleEntry,
          ),
        },
      ),
      {
        valid: true,
      },
    );
  });

  it("a => ba => bb => bc => a doesn't get flagged when none of them is in a via (group match)", () => {
    deepEqual(
      validate.dependency(
        lCycleViaRuleSet,
        { source: "tmp/a.js" },
        {
          resolved: "tmp/ba.js",
          circular: true,
          cycle: ["tmp/ba.js", "not-tmp/ab.js", "tmp/bc.js", "tmp/a.js"].map(
            stringToCycleEntry,
          ),
        },
      ),
      {
        valid: true,
      },
    );
  });

  it("a => aa => ab => ac => a get flagged when one of them is in a via", () => {
    deepEqual(
      validate.dependency(
        lCycleViaRuleSet,
        { source: "tmp/a.js" },
        {
          resolved: "tmp/aa.js",
          circular: true,
          cycle: ["tmp/aa.js", "tmp/ab.js", "tmp/ac.js", "tmp/a.js"].map(
            stringToCycleEntry,
          ),
        },
      ),
      {
        valid: false,
        rules: [{ name: "unnamed", severity: "warn" }],
      },
    );
  });

  it("a => aa => ab => ac => a get flagged when all of them are in a via", () => {
    const lRuleSet = parseRuleSet({
      forbidden: [
        {
          from: {},
          to: {
            circular: true,
            via: "^tmp/[^.]+\\.js$",
          },
        },
      ],
    });
    deepEqual(
      validate.dependency(
        lRuleSet,
        { source: "tmp/a.js" },
        {
          resolved: "tmp/aa.js",
          circular: true,
          cycle: ["tmp/aa.js", "tmp/ab.js", "tmp/ac.js", "tmp/a.js"].map(
            stringToCycleEntry,
          ),
        },
      ),
      {
        valid: false,
        rules: [{ name: "unnamed", severity: "warn" }],
      },
    );
  });
});

describe("[I] validate/index dependency - cycle viaSomeNot (normalizes to via.pathNot) - with group matching", () => {
  const lCycleButNotViaGroupMatchRuleSet = {
    forbidden: [
      {
        name: "no-circular-dependency-of-modules",
        from: { path: "^src/([^/]+)/.+" },
        to: { viaSomeNot: "^src/$1/.+", circular: true },
      },
    ],
  };

  it("flags when all of the cycle (except the root) is outside the group-matched viaSomeNot", () => {
    deepEqual(
      validate.dependency(
        parseRuleSet(lCycleButNotViaGroupMatchRuleSet),
        { source: "src/module-a/a.js" },
        {
          resolved: "src/module-b/ba.js",
          circular: true,
          cycle: [
            "src/module-b/ba.js",
            "src/module-b/bb.js",
            "src/module-b/bc.js",
            "src/module-a/a.js",
          ].map(stringToCycleEntry),
        },
      ),
      {
        valid: false,
        rules: [
          {
            name: "no-circular-dependency-of-modules",
            severity: "warn",
          },
        ],
      },
    );
  });

  it("flags when only one of the cycle is outside the group-matched viaNot", () => {
    deepEqual(
      validate.dependency(
        parseRuleSet(lCycleButNotViaGroupMatchRuleSet),
        { source: "src/module-a/a.js" },
        {
          resolved: "src/module-a/aa.js",
          circular: true,
          cycle: [
            "src/module-a/aa.js",
            "src/module-a/ab.js",
            "src/module-b/bc.js",
            "src/module-a/a.js",
          ].map(stringToCycleEntry),
        },
      ),
      {
        valid: false,
        rules: [
          {
            name: "no-circular-dependency-of-modules",
            severity: "warn",
          },
        ],
      },
    );
  });

  it("does not flag when all of the cycle is inside the group-matched viaNot", () => {
    deepEqual(
      validate.dependency(
        parseRuleSet(lCycleButNotViaGroupMatchRuleSet),
        { source: "src/module-a/a.js" },
        {
          resolved: "src/module-a/aa.js",
          circular: true,
          cycle: [
            "src/module-a/aa.js",
            "src/module-a/ab.js",
            "src/module-a/ac.js",
            "src/module-a/a.js",
          ].map(stringToCycleEntry),
        },
      ),
      {
        valid: true,
      },
    );
  });

  it("does not flag when all of the cycle is inside the group-matched viaSomeNot that's represented as an array", () => {
    const lRuleSet = {
      forbidden: [
        {
          name: "no-circular-dependency-of-modules",
          from: { path: "^src/([^/]+)/.+" },
          to: {
            viaSomeNot: "something|^src/$1/.+|somethingelse",
            circular: true,
          },
        },
      ],
    };
    deepEqual(
      validate.dependency(
        parseRuleSet(lRuleSet),
        { source: "src/module-a/a.js" },
        {
          resolved: "src/module-a/aa.js",
          circular: true,
          cycle: [
            "src/module-a/aa.js",
            "src/module-a/ab.js",
            "src/module-a/ac.js",
            "src/module-a/a.js",
          ].map(stringToCycleEntry),
        },
      ),
      {
        valid: true,
      },
    );
  });
});
