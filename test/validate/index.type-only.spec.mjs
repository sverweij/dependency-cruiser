import { expect } from "chai";
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
    expect(
      validate.dependency(
        lTypeOnlyRuleSet,
        { source: "src/koos-koets.ts" },
        {
          resolved: "src/robbie-kerkhof.ts",
          dependencyTypes: ["type-only", "local"],
        }
      )
    ).to.deep.equal({ valid: true });
  });

  it("only to type-only - with dependencyTypesNot in forbidden, multiple types - nok", () => {
    expect(
      validate.dependency(
        lTypeOnlyRuleSet,
        { source: "src/koos-koets.ts" },
        { resolved: "src/ger-hekking.ts", dependencyTypes: ["local"] }
      )
    ).to.deep.equal({
      valid: false,
      rules: [
        {
          name: "only-to-type-only",
          severity: "error",
        },
      ],
    });
  });
});
