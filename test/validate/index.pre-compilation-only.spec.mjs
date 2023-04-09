import { expect } from "chai";
import validate from "../../src/validate/index.mjs";
import parseRuleSet from "./parse-ruleset.utl.mjs";

describe("[I] validate/index - preCompilationOnly", () => {
  const lPreCompilationOnlyRuleSet = parseRuleSet({
    forbidden: [
      {
        name: "precomp",
        from: {},
        to: {
          preCompilationOnly: true,
        },
      },
    ],
  });
  it("Stuff that still exists after compilation - okeleedokelee", () => {
    expect(
      validate.dependency(
        lPreCompilationOnlyRuleSet,
        { source: "something" },
        { resolved: "real-stuff-only.ts", preCompilationOnly: false }
      )
    ).to.deep.equal({ valid: true });
  });

  it("Stuff that only exists before compilation - flaggeleedaggelee", () => {
    expect(
      validate.dependency(
        lPreCompilationOnlyRuleSet,
        { source: "something" },
        { resolved: "types.d.ts", preCompilationOnly: true }
      )
    ).to.deep.equal({
      rules: [{ name: "precomp", severity: "warn" }],
      valid: false,
    });
  });

  it("Unknown whether stuff that only exists before compilation - okeleedokelee", () => {
    expect(
      validate.dependency(
        lPreCompilationOnlyRuleSet,
        { source: "something" },
        { resolved: "types.d.ts" }
      )
    ).to.deep.equal({ valid: true });
  });
});
