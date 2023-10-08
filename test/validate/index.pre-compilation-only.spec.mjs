import { deepEqual } from "node:assert/strict";
import parseRuleSet from "./parse-ruleset.utl.mjs";
import validate from "#validate/index.mjs";

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
    deepEqual(
      validate.dependency(
        lPreCompilationOnlyRuleSet,
        { source: "something" },
        { resolved: "real-stuff-only.ts", preCompilationOnly: false },
      ),
      { valid: true },
    );
  });

  it("Stuff that only exists before compilation - flaggeleedaggelee", () => {
    deepEqual(
      validate.dependency(
        lPreCompilationOnlyRuleSet,
        { source: "something" },
        { resolved: "types.d.ts", preCompilationOnly: true },
      ),
      {
        rules: [{ name: "precomp", severity: "warn" }],
        valid: false,
      },
    );
  });

  it("Unknown whether stuff that only exists before compilation - okeleedokelee", () => {
    deepEqual(
      validate.dependency(
        lPreCompilationOnlyRuleSet,
        { source: "something" },
        { resolved: "types.d.ts" },
      ),
      { valid: true },
    );
  });
});
