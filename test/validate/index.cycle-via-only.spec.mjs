import { deepEqual } from "node:assert/strict";
import parseRuleSet from "./parse-ruleset.utl.mjs";
import { validateDependency } from "#validate/index.mjs";

function stringToCycleEntry(pString) {
  return {
    name: pString,
    dependencyTypes: [],
  };
}

describe("[I] validate/index dependency - cycle viaOnly", () => {
  const lCycleViaRuleSet = parseRuleSet({
    forbidden: [
      {
        from: {},
        to: {
          circular: true,
          viaOnly: { path: "^tmp/ab\\.js$" },
        },
      },
    ],
  });

  it("a => ba => bb => bc => a doesn't get flagged when the cycle doesn't go via the viaOnly", () => {
    deepEqual(
      validateDependency(
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
      validateDependency(
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

  it("a => ab a gets flagged because all of the via's in the cycle are in the viaOnly", () => {
    deepEqual(
      validateDependency(
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
      validateDependency(
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

  const lCycleViaNotTypeOnlyRuleSet = parseRuleSet({
    forbidden: [
      {
        name: "no-runtime-cycles",
        from: {},
        severity: "error",
        to: {
          circular: true,
          viaOnly: { dependencyTypesNot: ["type-only"] },
        },
      },
    ],
  });

  it("a => aa => ab => ac => a doesn't get flagged when one of the dependencyTypes is in a pathNot", () => {
    deepEqual(
      validateDependency(
        lCycleViaNotTypeOnlyRuleSet,
        { source: "tmp/a.js" },
        {
          resolved: "tmp/aa.js",
          circular: true,
          cycle: [
            { name: "tmp/aa.js", dependencyTypes: ["import"] },
            { name: "tmp/ab.js", dependencyTypes: ["import", "type-only"] },
            { name: "tmp/ac.js", dependencyTypes: ["import"] },
            { name: "tmp/a.js", dependencyTypes: ["import"] },
          ],
        },
      ),
      {
        valid: true,
      },
    );
  });

  it("a => aa => ab => ac => a does get flagged when none of the dependencyTypes is in a pathNot", () => {
    deepEqual(
      validateDependency(
        lCycleViaNotTypeOnlyRuleSet,
        { source: "tmp/a.js" },
        {
          resolved: "tmp/aa.js",
          circular: true,
          cycle: [
            { name: "tmp/aa.js", dependencyTypes: ["import"] },
            { name: "tmp/ab.js", dependencyTypes: ["import"] },
            { name: "tmp/ac.js", dependencyTypes: ["import"] },
            { name: "tmp/a.js", dependencyTypes: ["import"] },
          ],
        },
      ),
      {
        rules: [
          {
            name: "no-runtime-cycles",
            severity: "error",
          },
        ],
        valid: false,
      },
    );
  });

  const lCycleViaTypeOnlyRuleSet = parseRuleSet({
    forbidden: [
      {
        name: "flags-import-only-cycles",
        from: {},
        severity: "error",
        to: {
          circular: true,
          viaOnly: { dependencyTypes: ["import"] },
        },
      },
    ],
  });
  it("a => aa => ab => ac => a does get flagged when none of the dependencyTypes is in a via", () => {
    deepEqual(
      validateDependency(
        lCycleViaTypeOnlyRuleSet,
        { source: "tmp/a.js" },
        {
          resolved: "tmp/aa.js",
          circular: true,
          cycle: [
            { name: "tmp/aa.js", dependencyTypes: ["import"] },
            { name: "tmp/ab.js", dependencyTypes: ["import"] },
            { name: "tmp/ac.js", dependencyTypes: ["import"] },
            { name: "tmp/a.js", dependencyTypes: ["import"] },
          ],
        },
      ),
      {
        rules: [
          {
            name: "flags-import-only-cycles",
            severity: "error",
          },
        ],
        valid: false,
      },
    );
  });

  it("a => aa => ab => ac => a doesn't get flagged when none of the dependencyTypes is in a via", () => {
    deepEqual(
      validateDependency(
        lCycleViaTypeOnlyRuleSet,
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
        valid: true,
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
          viaOnly: { path: "^($1)/ab\\.js$" },
        },
      },
    ],
  });

  it("a => ba => bb => bc => a doesn't get flagged when the cycle doesn't go via the viaOnly", () => {
    deepEqual(
      validateDependency(
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
      validateDependency(
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
      validateDependency(
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
      validateDependency(
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
            viaOnly: { path: "somethingelse|^tmp/[^.]+\\.js$" },
          },
        },
      ],
    });
    deepEqual(
      validateDependency(
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

describe("[I] validate/index dependency - cycle viaNot (which normalizes to viaOnly.pathNot)", () => {
  const lCycleViaNotRuleSet = parseRuleSet({
    forbidden: [
      {
        from: {},
        to: {
          circular: true,
          viaNot: "^tmp/ab\\.js$",
        },
      },
    ],
  });

  it("a => ba => bb => bc => a get flagged when none of them is in a viaNot", () => {
    deepEqual(
      validateDependency(
        lCycleViaNotRuleSet,
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
        valid: false,
        rules: [{ name: "unnamed", severity: "warn" }],
      },
    );
  });

  it("a => aa => ab => ac => a doesn't get flagged when one of them is in a viaNot", () => {
    deepEqual(
      validateDependency(
        lCycleViaNotRuleSet,
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
});
