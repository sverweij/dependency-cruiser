const { expect } = require("chai");
const readRuleSet = require("./readruleset.utl");
const validate = require("~/src/validate");

describe("validate/index - exoticallyRequired", () => {
  it("does not flag dependencies that are required with a regular require or import", () => {
    expect(
      validate.dependency(
        readRuleSet("./test/validate/fixtures/rules.exotically-required.json"),
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
        readRuleSet("./test/validate/fixtures/rules.exotically-required.json"),
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

describe("validate/index - exoticRequire", () => {
  it("does not flag dependencies that are required with a regular require or import", () => {
    expect(
      validate.dependency(
        readRuleSet("./test/validate/fixtures/rules.exotic-require.json"),
        { source: "something" },
        { resolved: "src/aap/speeltuigen/autoband.ts" }
      )
    ).to.deep.equal({ valid: true });
  });

  it("does not flag dependencies that are required with an exotic require not in the forbdidden RE", () => {
    expect(
      validate.dependency(
        readRuleSet("./test/validate/fixtures/rules.exotic-require.json"),
        { source: "something" },
        { resolved: "src/aap/speeltuigen/autoband.ts", exoticRequire: "notUse" }
      )
    ).to.deep.equal({ valid: true });
  });

  it("flags dependencies that are required with a forbidden exotic require", () => {
    expect(
      validate.dependency(
        readRuleSet("./test/validate/fixtures/rules.exotic-require.json"),
        { source: "something" },
        { resolved: "src/aap/speeltuigen/autoband.ts", exoticRequire: "use" }
      )
    ).to.deep.equal({
      valid: false,
      rules: [{ name: "no-use-as-exotic-require", severity: "warn" }],
    });
  });
});

describe("validate/index - exoticRequireNot", () => {
  it("does not flag dependencies that are required with a regular require or import", () => {
    expect(
      validate.dependency(
        readRuleSet("./test/validate/fixtures/rules.exotic-require-not.json"),
        { source: "something" },
        { resolved: "src/aap/speeltuigen/autoband.ts" }
      )
    ).to.deep.equal({ valid: true });
  });

  it("does not flag dependencies that are required with a sanctioned exotic require", () => {
    expect(
      validate.dependency(
        readRuleSet("./test/validate/fixtures/rules.exotic-require-not.json"),
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
        readRuleSet("./test/validate/fixtures/rules.exotic-require-not.json"),
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
