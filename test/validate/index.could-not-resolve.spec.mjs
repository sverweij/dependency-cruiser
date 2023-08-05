import { deepStrictEqual } from "node:assert";
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
    deepStrictEqual(
      validate.dependency(
        lNotToUnresolvableRuleSet,
        { source: "koos koets" },
        { resolved: "diana charitee", couldNotResolve: false },
      ),
      { valid: true },
    );
  });

  it("not to unresolvable - violation", () => {
    deepStrictEqual(
      validate.dependency(
        lNotToUnresolvableRuleSet,
        { source: "koos koets" },
        { resolved: "diana charitee", couldNotResolve: true },
      ),
      {
        valid: false,
        rules: [{ severity: "error", name: "not-to-unresolvable" }],
      },
    );
  });
});
