import { deepEqual } from "node:assert/strict";
import parseRuleSet from "./parse-ruleset.utl.mjs";
import validate from "#validate/index.mjs";

function stringToCycleEntry(pString) {
  return {
    name: pString,
    dependencyTypes: [],
  };
}

describe("[I] validate/index dependency - cycle viaNot", () => {
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

  const lCycleViaNotTypeOnlyRuleSet = parseRuleSet({
    forbidden: [
      {
        name: "no-runtime-cycles",
        from: {},
        severity: "error",
        to: {
          circular: true,
          viaNot: { dependencyTypes: ["type-only"] },
        },
      },
    ],
  });
  it("a => ba => bb => bc => a get flagged when none of them is in a viaNot", () => {
    deepEqual(
      validate.dependency(
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
      validate.dependency(
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

  it("a => aa => ab => ac => a doesn't get flagged when one of the dependencyTypes is in a viaNot", () => {
    deepEqual(
      validate.dependency(
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

  it("a => aa => ab => ac => a does get flagged when none of the dependencyTypes is in a viaNot", () => {
    deepEqual(
      validate.dependency(
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
});

describe("[I] validate/index dependency - cycle viaNot - with group matching", () => {
  const lCycleButNotViaGroupMatchRuleSet = {
    forbidden: [
      {
        name: "no-circular-dependency-of-modules",
        from: { path: "^src/([^/]+)/.+" },
        to: { viaNot: { path: "^src/$1/.+" }, circular: true },
      },
    ],
  };

  it("flags when all of the cycle (except the root) is outside the group-matched viaNot", () => {
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
        valid: true,
      },
    );
  });

  it("does not flag when only one of the cycle is outside the group-matched viaNot", () => {
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
        valid: true,
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
});
