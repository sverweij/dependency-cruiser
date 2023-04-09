import { expect } from "chai";
import validate from "../../src/validate/index.mjs";
import parseRuleSet from "./parse-ruleset.utl.mjs";

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
    expect(
      validate.dependency(
        lExoticallyRequiredRuleSet,
        { source: "something" },
        {
          resolved: "src/aap/speeltuigen/autoband.ts",
          exoticallyRequired: false,
        }
      )
    ).to.deep.equal({ valid: true });
  });

  it("does flag dependencies that are required with any exotic require", () => {
    expect(
      validate.dependency(
        lExoticallyRequiredRuleSet,
        { source: "something" },
        {
          resolved: "src/aap/speeltuigen/autoband.ts",
          exoticRequire: "notUse",
          exoticallyRequired: true,
        }
      )
    ).to.deep.equal({
      rules: [{ name: "no-exotic-requires-period", severity: "warn" }],
      valid: false,
    });
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
    expect(
      validate.dependency(
        lExoticRequireRuleSet,
        { source: "something" },
        { resolved: "src/aap/speeltuigen/autoband.ts" }
      )
    ).to.deep.equal({ valid: true });
  });

  it("does not flag dependencies that are required with an exotic require not in the forbdidden RE", () => {
    expect(
      validate.dependency(
        lExoticRequireRuleSet,
        { source: "something" },
        { resolved: "src/aap/speeltuigen/autoband.ts", exoticRequire: "notUse" }
      )
    ).to.deep.equal({ valid: true });
  });

  it("flags dependencies that are required with a forbidden exotic require", () => {
    expect(
      validate.dependency(
        lExoticRequireRuleSet,
        { source: "something" },
        { resolved: "src/aap/speeltuigen/autoband.ts", exoticRequire: "use" }
      )
    ).to.deep.equal({
      valid: false,
      rules: [{ name: "no-use-as-exotic-require", severity: "warn" }],
    });
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
    expect(
      validate.dependency(
        lExoticRequireNotRuleSet,
        { source: "something" },
        { resolved: "src/aap/speeltuigen/autoband.ts" }
      )
    ).to.deep.equal({ valid: true });
  });

  it("does not flag dependencies that are required with a sanctioned exotic require", () => {
    expect(
      validate.dependency(
        lExoticRequireNotRuleSet,
        { source: "something" },
        {
          resolved: "src/aap/speeltuigen/autoband.ts",
          exoticRequire: "use",
        }
      )
    ).to.deep.equal({ valid: true });
  });

  it("flags dependencies are required with an unsanctioned exotic require", () => {
    expect(
      validate.dependency(
        lExoticRequireNotRuleSet,
        { source: "something" },
        {
          resolved: "src/aap/speeltuigen/autoband.ts",
          exoticRequire: "notuse",
        }
      )
    ).to.deep.equal({
      valid: false,
      rules: [{ name: "only-use-as-exotic-require", severity: "warn" }],
    });
  });
});
