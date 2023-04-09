import { expect } from "chai";
import validate from "../../src/validate/index.mjs";
import parseRuleSet from "./parse-ruleset.utl.mjs";

describe("[I] validate/index - couldNotResolve", () => {
  const lNotToUnresolvableRuleSet = parseRuleSet({
    forbidden: [
      {
        name: "not-to-unresolvable",
        severity: "error",
        from: {},
        to: {
          couldNotResolve: true,
        },
      },
    ],
  });

  it("not to unresolvable - ok", () => {
    expect(
      validate.dependency(
        lNotToUnresolvableRuleSet,
        { source: "koos koets" },
        { resolved: "diana charitee", couldNotResolve: false }
      )
    ).to.deep.equal({ valid: true });
  });

  it("not to unresolvable - violation", () => {
    expect(
      validate.dependency(
        lNotToUnresolvableRuleSet,
        { source: "koos koets" },
        { resolved: "diana charitee", couldNotResolve: true }
      )
    ).to.deep.equal({
      valid: false,
      rules: [{ severity: "error", name: "not-to-unresolvable" }],
    });
  });
});
