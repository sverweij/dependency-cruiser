import { deepEqual } from "node:assert/strict";
import validate from "../../src/validate/index.mjs";
import parseRuleSet from "./parse-ruleset.utl.mjs";

describe("[I] validate/index - orphans", () => {
  const lOrphanRuleSet = parseRuleSet({
    forbidden: [
      {
        name: "no-orphans",
        from: { orphan: true },
        to: {},
      },
    ],
  });

  it("Skips modules that have no orphan attribute", () => {
    deepEqual(validate.module(lOrphanRuleSet, { source: "something" }), {
      valid: true,
    });
  });

  it("Flags modules that are orphans", () => {
    deepEqual(
      validate.module(lOrphanRuleSet, {
        source: "something",
        orphan: true,
      }),
      {
        valid: false,
        rules: [
          {
            name: "no-orphans",
            severity: "warn",
          },
        ],
      },
    );
  });
});
describe("[I] validate/index - orphans in 'allowed' rules", () => {
  const lOrphansAllowedRuleSet = parseRuleSet({
    allowed: [
      {
        from: { orphan: false },
        to: {},
      },
    ],
  });

  it("Flags modules that are orphans if they're in the 'allowed' section", () => {
    deepEqual(
      validate.module(lOrphansAllowedRuleSet, {
        source: "something",
        orphan: true,
      }),
      {
        valid: false,
        rules: [
          {
            name: "not-in-allowed",
            severity: "warn",
          },
        ],
      },
    );
  });

  it("Leaves modules alone that aren't orphans if there's a rule in the 'allowed' section forbidding them", () => {
    deepEqual(
      validate.module(lOrphansAllowedRuleSet, {
        source: "something",
        orphan: false,
      }),
      { valid: true },
    );
  });
});

describe("[I] validate/index - orphans combined with path/ pathNot", () => {
  const lOrphanPathRuleSet = parseRuleSet({
    forbidden: [
      {
        name: "no-orphans",
        severity: "error",
        from: { orphan: true, path: "noorphansallowedhere" },
        to: {},
      },
    ],
  });
  const lOrphanPathNotRuleSet = parseRuleSet({
    forbidden: [
      {
        name: "no-orphans",
        from: { orphan: true, pathNot: "orphansallowedhere" },
        to: {},
      },
    ],
  });
  it("Leaves modules that are orphans, but that don't match the rule path", () => {
    deepEqual(
      validate.module(lOrphanPathRuleSet, {
        source: "something",
        orphan: true,
      }),
      { valid: true },
    );
  });

  it("Flags modules that are orphans and that match the rule's path", () => {
    deepEqual(
      validate.module(lOrphanPathRuleSet, {
        source: "noorphansallowedhere/blah/something.ts",
        orphan: true,
      }),
      {
        valid: false,
        rules: [
          {
            name: "no-orphans",
            severity: "error",
          },
        ],
      },
    );
  });

  it("Leaves modules that are orphans, but that do match the rule's pathNot", () => {
    deepEqual(
      validate.module(lOrphanPathNotRuleSet, {
        source: "orphansallowedhere/something",
        orphan: true,
      }),
      { valid: true },
    );
  });

  it("Flags modules that are orphans, but that do not match the rule's pathNot", () => {
    deepEqual(
      validate.module(lOrphanPathNotRuleSet, {
        source: "blah/something.ts",
        orphan: true,
      }),
      {
        valid: false,
        rules: [
          {
            name: "no-orphans",
            severity: "warn",
          },
        ],
      },
    );
  });

  it("The 'dependency' validation leaves the module only orphan rule alone", () => {
    deepEqual(
      validate.dependency(
        lOrphanPathRuleSet,
        {
          source: "noorphansallowedhere/something.ts",
          orphan: true,
        },
        {},
      ),
      { valid: true },
    );
  });
});
