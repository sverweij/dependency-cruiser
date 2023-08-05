import { deepStrictEqual } from "node:assert";
import { describe, it } from "node:test";
import validate from "../../src/validate/index.mjs";
import parseRuleSet from "./parse-ruleset.utl.mjs";

describe("[I] [I] validate/index - type-only", () => {
  const lTypeOnlyRuleSet = parseRuleSet({
    forbidden: [
      {
        name: "only-to-type-only",
        severity: "error",
        from: {},
        to: {
          dependencyTypesNot: ["type-only"],
        },
      },
    ],
  });

  it("only to type-only - with dependencyTypesNot in forbidden, multiple types - ok", () => {
    deepStrictEqual(
      validate.dependency(
        lTypeOnlyRuleSet,
        { source: "src/koos-koets.ts" },
        {
          resolved: "src/robbie-kerkhof.ts",
          dependencyTypes: ["type-only", "local"],
        }
      ),
      { valid: true }
    );
  });

  it("only to type-only - with dependencyTypesNot in forbidden, multiple types - nok", () => {
    deepStrictEqual(
      validate.dependency(
        lTypeOnlyRuleSet,
        { source: "src/koos-koets.ts" },
        { resolved: "src/ger-hekking.ts", dependencyTypes: ["local"] }
      ),
      {
        valid: false,
        rules: [
          {
            name: "only-to-type-only",
            severity: "error",
          },
        ],
      }
    );
  });
});
