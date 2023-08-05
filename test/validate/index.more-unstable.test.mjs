import { deepStrictEqual } from "node:assert";
import { describe, it } from "node:test";
import validate from "../../src/validate/index.mjs";
import parseRuleSet from "./parse-ruleset.utl.mjs";

describe("[I] validate/index - stability checks", () => {
  const lForbiddenRuleSet = parseRuleSet({
    forbidden: [
      {
        name: "SDP",
        severity: "info",
        from: {},
        to: {
          moreUnstable: true,
        },
      },
    ],
  });
  const lAllowedRuleSet = parseRuleSet({
    allowedSeverity: "info",
    allowed: [
      {
        from: {},
        to: {
          moreUnstable: false,
        },
      },
    ],
  });

  it("moreUnstable: flags when depending on a module that is more unstable (moreUnstable=true, forbidden)", () => {
    deepStrictEqual(
      validate.dependency(
        lForbiddenRuleSet,
        { source: "something", instability: 0 },
        {
          resolved: "src/some/thing/else.js",
          instability: 1,
        }
      ),
      {
        valid: false,
        rules: [{ name: "SDP", severity: "info" }],
      }
    );
  });

  it("moreUnstable: does not flag when depending on a module that is more stable (moreUnstable=true, forbidden)", () => {
    deepStrictEqual(
      validate.dependency(
        lForbiddenRuleSet,
        { source: "something", instability: 1 },
        {
          resolved: "src/some/thing/else.js",
          instability: 0.1,
        }
      ),
      {
        valid: true,
      }
    );
  });

  it("moreUnstable: flags when depending on a module that is more unstable (moreUnstable=false, allowed)", () => {
    deepStrictEqual(
      validate.dependency(
        lAllowedRuleSet,
        { source: "something", instability: 0 },
        {
          resolved: "src/some/thing/else.js",
          instability: 1,
        }
      ),
      {
        valid: false,
        rules: [{ name: "not-in-allowed", severity: "info" }],
      }
    );
  });

  it("moreUnstable: does not flag when depending on a module that is more stable (moreUnstable=false, allowed)", () => {
    deepStrictEqual(
      validate.dependency(
        lAllowedRuleSet,
        { source: "something", instability: 1 },
        {
          resolved: "src/some/thing/else.js",
          instability: 0.1,
        }
      ),
      {
        valid: true,
      }
    );
  });
});
