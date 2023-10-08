import { deepEqual } from "node:assert/strict";
import parseRuleSet from "./parse-ruleset.utl.mjs";
import validate from "#validate/index.mjs";

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
    deepEqual(
      validate.dependency(
        lNotToUnresolvableRuleSet,
        { source: "koos koets" },
        { resolved: "diana charitee", couldNotResolve: false },
      ),
      { valid: true },
    );
  });

  it("not to unresolvable - violation", () => {
    deepEqual(
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
