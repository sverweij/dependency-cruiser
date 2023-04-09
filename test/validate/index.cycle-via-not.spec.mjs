import { expect } from "chai";
import validate from "../../src/validate/index.mjs";
import parseRuleSet from "./parse-ruleset.utl.mjs";

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
  it("a => ba => bb => bc => a get flagged when none of them is in a viaNot", () => {
    expect(
      validate.dependency(
        lCycleViaNotRuleSet,
        { source: "tmp/a.js" },
        {
          resolved: "tmp/ba.js",
          circular: true,
          cycle: ["tmp/ba.js", "tmp/bb.js", "tmp/bc.js", "tmp/a.js"],
        }
      )
    ).to.deep.equal({
      valid: false,
      rules: [{ name: "unnamed", severity: "warn" }],
    });
  });

  it("a => aa => ab => ac => a doesn't get flagged when one of them is in a viaNot", () => {
    expect(
      validate.dependency(
        lCycleViaNotRuleSet,
        { source: "tmp/a.js" },
        {
          resolved: "tmp/aa.js",
          circular: true,
          cycle: ["tmp/aa.js", "tmp/ab.js", "tmp/ac.js", "tmp/a.js"],
        }
      )
    ).to.deep.equal({
      valid: true,
    });
  });
});

describe("[I] validate/index dependency - cycle viaNot - with group matching", () => {
  const lCycleButNotViaGroupMatchRuleSet = {
    forbidden: [
      {
        name: "no-circular-dependency-of-modules",
        from: { path: "^src/([^/]+)/.+" },
        to: { viaNot: "^src/$1/.+", circular: true },
      },
    ],
  };

  it("flags when all of the cycle (except the root) is outside the group-matched viaNot", () => {
    expect(
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
          ],
        }
      )
    ).to.deep.equal({
      valid: true,
    });
  });

  it("does not flag when only one of the cycle is outside the group-matched viaNot", () => {
    expect(
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
          ],
        }
      )
    ).to.deep.equal({
      valid: true,
    });
  });

  it("does not flag when all of the cycle is inside the group-matched viaNot", () => {
    expect(
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
          ],
        }
      )
    ).to.deep.equal({
      valid: true,
    });
  });
});
