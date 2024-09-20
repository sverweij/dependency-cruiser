import { deepEqual } from "node:assert/strict";
import parseRuleSet from "./parse-ruleset.utl.mjs";
import { validateDependency } from "#validate/index.mjs";

describe("[I] validate/index - exoticallyRequired", () => {
  const lExoticallyRequiredRuleSet = parseRuleSet({
    forbidden: [
      {
        name: "no-exotic-requires-period",
        from: {},
        to: { exoticallyRequired: true },
      },
    ],
  });
  it("does not flag dependencies that are required with a regular require or import", () => {
    deepEqual(
      validateDependency(
        lExoticallyRequiredRuleSet,
        { source: "something" },
        {
          resolved: "src/aap/speeltuigen/autoband.ts",
          exoticallyRequired: false,
        },
      ),
      { valid: true },
    );
  });

  it("does flag dependencies that are required with any exotic require", () => {
    deepEqual(
      validateDependency(
        lExoticallyRequiredRuleSet,
        { source: "something" },
        {
          resolved: "src/aap/speeltuigen/autoband.ts",
          exoticRequire: "notUse",
          exoticallyRequired: true,
        },
      ),
      {
        rules: [{ name: "no-exotic-requires-period", severity: "warn" }],
        valid: false,
      },
    );
  });
});

describe("[I] validate/index - exoticRequire", () => {
  const lExoticRequireRuleSet = parseRuleSet({
    forbidden: [
      {
        name: "no-use-as-exotic-require",
        from: {},
        to: { exoticRequire: "^use$" },
      },
    ],
  });
  it("does not flag dependencies that are required with a regular require or import", () => {
    deepEqual(
      validateDependency(
        lExoticRequireRuleSet,
        { source: "something" },
        { resolved: "src/aap/speeltuigen/autoband.ts" },
      ),
      { valid: true },
    );
  });

  it("does not flag dependencies that are required with an exotic require not in the forbdidden RE", () => {
    deepEqual(
      validateDependency(
        lExoticRequireRuleSet,
        { source: "something" },
        {
          resolved: "src/aap/speeltuigen/autoband.ts",
          exoticRequire: "notUse",
        },
      ),
      { valid: true },
    );
  });

  it("flags dependencies that are required with a forbidden exotic require", () => {
    deepEqual(
      validateDependency(
        lExoticRequireRuleSet,
        { source: "something" },
        { resolved: "src/aap/speeltuigen/autoband.ts", exoticRequire: "use" },
      ),
      {
        valid: false,
        rules: [{ name: "no-use-as-exotic-require", severity: "warn" }],
      },
    );
  });
});

describe("[I] validate/index - exoticRequireNot", () => {
  const lExoticRequireNotRuleSet = parseRuleSet({
    forbidden: [
      {
        name: "only-use-as-exotic-require",
        from: {},
        to: { exoticRequireNot: "^use$" },
      },
    ],
  });
  it("does not flag dependencies that are required with a regular require or import", () => {
    deepEqual(
      validateDependency(
        lExoticRequireNotRuleSet,
        { source: "something" },
        { resolved: "src/aap/speeltuigen/autoband.ts" },
      ),
      { valid: true },
    );
  });

  it("does not flag dependencies that are required with a sanctioned exotic require", () => {
    deepEqual(
      validateDependency(
        lExoticRequireNotRuleSet,
        { source: "something" },
        {
          resolved: "src/aap/speeltuigen/autoband.ts",
          exoticRequire: "use",
        },
      ),
      { valid: true },
    );
  });

  it("flags dependencies are required with an unsanctioned exotic require", () => {
    deepEqual(
      validateDependency(
        lExoticRequireNotRuleSet,
        { source: "something" },
        {
          resolved: "src/aap/speeltuigen/autoband.ts",
          exoticRequire: "notuse",
        },
      ),
      {
        valid: false,
        rules: [{ name: "only-use-as-exotic-require", severity: "warn" }],
      },
    );
  });
});
