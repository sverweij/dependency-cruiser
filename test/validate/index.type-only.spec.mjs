import { deepEqual } from "node:assert/strict";
import parseRuleSet from "./parse-ruleset.utl.mjs";
import validate from "#validate/index.mjs";

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
    deepEqual(
      validate.dependency(
        lTypeOnlyRuleSet,
        { source: "src/koos-koets.ts" },
        {
          resolved: "src/robbie-kerkhof.ts",
          dependencyTypes: ["type-only", "local"],
        },
      ),
      { valid: true },
    );
  });

  it("only to type-only - with dependencyTypesNot in forbidden, multiple types - nok", () => {
    deepEqual(
      validate.dependency(
        lTypeOnlyRuleSet,
        { source: "src/koos-koets.ts" },
        { resolved: "src/ger-hekking.ts", dependencyTypes: ["local"] },
      ),
      {
        valid: false,
        rules: [
          {
            name: "only-to-type-only",
            severity: "error",
          },
        ],
      },
    );
  });
});
