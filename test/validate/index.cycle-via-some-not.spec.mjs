import { expect } from "chai";
import validate from "../../src/validate/index.mjs";
import parseRuleSet from "./parse-ruleset.utl.mjs";

describe("[I] validate/index dependency - cycle viaSomeNot - with group matching", () => {
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
      valid: false,
      rules: [
        {
          name: "no-circular-dependency-of-modules",
          severity: "warn",
        },
      ],
    });
  });

  it("flags when only one of the cycle is outside the group-matched viaNot", () => {
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
      valid: false,
      rules: [
        {
          name: "no-circular-dependency-of-modules",
          severity: "warn",
        },
      ],
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

  it("does not flag when all of the cycle is inside the group-matched viaSomeNot that's represented as an array", () => {
    const lRuleSet = {
      forbidden: [
        {
          name: "no-circular-dependency-of-modules",
          from: { path: "^src/([^/]+)/.+" },
          to: {
            viaSomeNot: ["something", "^src/$1/.+", "somethingelse"],
            circular: true,
          },
        },
      ],
    };
    expect(
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
          ],
        }
      )
    ).to.deep.equal({
      valid: true,
    });
  });
});
