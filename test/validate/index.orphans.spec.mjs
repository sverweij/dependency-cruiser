import { expect } from "chai";
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
    expect(
      validate.module(lOrphanRuleSet, { source: "something" })
    ).to.deep.equal({ valid: true });
  });

  it("Flags modules that are orphans", () => {
    expect(
      validate.module(lOrphanRuleSet, {
        source: "something",
        orphan: true,
      })
    ).to.deep.equal({
      valid: false,
      rules: [
        {
          name: "no-orphans",
          severity: "warn",
        },
      ],
    });
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
    expect(
      validate.module(lOrphansAllowedRuleSet, {
        source: "something",
        orphan: true,
      })
    ).to.deep.equal({
      valid: false,
      rules: [
        {
          name: "not-in-allowed",
          severity: "warn",
        },
      ],
    });
  });

  it("Leaves modules alone that aren't orphans if there's a rule in the 'allowed' section forbidding them", () => {
    expect(
      validate.module(lOrphansAllowedRuleSet, {
        source: "something",
        orphan: false,
      })
    ).to.deep.equal({ valid: true });
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
    expect(
      validate.module(lOrphanPathRuleSet, {
        source: "something",
        orphan: true,
      })
    ).to.deep.equal({ valid: true });
  });

  it("Flags modules that are orphans and that match the rule's path", () => {
    expect(
      validate.module(lOrphanPathRuleSet, {
        source: "noorphansallowedhere/blah/something.ts",
        orphan: true,
      })
    ).to.deep.equal({
      valid: false,
      rules: [
        {
          name: "no-orphans",
          severity: "error",
        },
      ],
    });
  });

  it("Leaves modules that are orphans, but that do match the rule's pathNot", () => {
    expect(
      validate.module(lOrphanPathNotRuleSet, {
        source: "orphansallowedhere/something",
        orphan: true,
      })
    ).to.deep.equal({ valid: true });
  });

  it("Flags modules that are orphans, but that do not match the rule's pathNot", () => {
    expect(
      validate.module(lOrphanPathNotRuleSet, {
        source: "blah/something.ts",
        orphan: true,
      })
    ).to.deep.equal({
      valid: false,
      rules: [
        {
          name: "no-orphans",
          severity: "warn",
        },
      ],
    });
  });

  it("The 'dependency' validation leaves the module only orphan rule alone", () => {
    expect(
      validate.dependency(
        lOrphanPathRuleSet,
        {
          source: "noorphansallowedhere/something.ts",
          orphan: true,
        },
        {}
      )
    ).to.deep.equal({ valid: true });
  });
});
