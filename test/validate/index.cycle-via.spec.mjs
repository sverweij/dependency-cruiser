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
          via: "^tmp/ab\\.js$",
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

describe("[I] validate/index dependency - cycle via - with group matching", () => {
  const lCycleViaRuleSet = parseRuleSet({
    forbidden: [
      {
        from: {
          path: "^([^/]+)",
        },
        to: {
          circular: true,
          via: "^$1/ab\\.js$",
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

describe("[I] validate/index dependency - cycle viaOnly", () => {
  const lCycleViaRuleSet = parseRuleSet({
    forbidden: [
      {
        from: {},
        to: {
          circular: true,
          viaOnly: "^tmp/ab\\.js$",
        },
      },
    ],
  });

  it("a => ba => bb => bc => a doesn't get flagged when the cycle doesn't go via the viaOnly", () => {
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

  it("a => aa => ab => ac => does not get flagged when only some of them are not in the viaOnly", () => {
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
        valid: true,
      },
    );
  });

  it("a => ab a gets flagged becaue all of the via's in the cycle are in the viaOnly", () => {
    deepEqual(
      validate.dependency(
        lCycleViaRuleSet,
        { source: "tmp/a.js" },
        {
          resolved: "tmp/aa.js",
          circular: true,
          cycle: ["tmp/ab.js", "tmp/a.js"].map(stringToCycleEntry),
        },
      ),
      {
        valid: true,
      },
    );
  });

  it("a => aa => ab => ac => a get flagged when all of them are in a viaOnly", () => {
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
describe("[I] validate/index dependency - cycle viaOnly - with group matching", () => {
  const lCycleViaRuleSet = parseRuleSet({
    forbidden: [
      {
        from: {
          path: "^([^/]+)/.+",
        },
        to: {
          circular: true,
          viaOnly: "^($1)/ab\\.js$",
        },
      },
    ],
  });

  it("a => ba => bb => bc => a doesn't get flagged when the cycle doesn't go via the viaOnly", () => {
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

  it("a => aa => ab => ac => does not get flagged when only some of them are not in the viaOnly", () => {
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
        valid: true,
      },
    );
  });

  it("a => ab a gets flagged becaue all of the via's in the cycle are in the viaOnly", () => {
    deepEqual(
      validate.dependency(
        lCycleViaRuleSet,
        { source: "tmp/a.js" },
        {
          resolved: "tmp/aa.js",
          circular: true,
          cycle: ["tmp/ab.js", "tmp/a.js"].map(stringToCycleEntry),
        },
      ),
      {
        valid: true,
      },
    );
  });

  it("a => aa => ab => ac => a get flagged when all of them are in a viaOnly", () => {
    const lRuleSet = parseRuleSet({
      forbidden: [
        {
          from: {},
          to: {
            circular: true,
            viaOnly: "^tmp/[^.]+\\.js$",
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
  it("a => aa => ab => ac => a get flagged when all of them are in a viaOnly presented as an array", () => {
    const lRuleSet = parseRuleSet({
      forbidden: [
        {
          from: {},
          to: {
            circular: true,
            viaOnly: ["somethingelse", "^tmp/[^.]+\\.js$"],
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
