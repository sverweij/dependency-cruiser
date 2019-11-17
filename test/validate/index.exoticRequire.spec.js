const expect = require("chai").expect;
const validate = require("../../src/validate");
const readRuleSet = require("./readruleset.utl");

describe("validate/index - exoticRequire", () => {
  it("does not flag dependencies that are required with a regular require or import", () => {
    expect(
      validate.dependency(
        true,
        readRuleSet("./test/validate/fixtures/rules.exotic-require.json"),
        { source: "something" },
        { resolved: "src/aap/speeltuigen/autoband.ts" }
      )
    ).to.deep.equal({ valid: true });
  });

  it("does not flag dependencies that are required with an exotic require not in the forbdidden RE", () => {
    expect(
      validate.dependency(
        true,
        readRuleSet("./test/validate/fixtures/rules.exotic-require.json"),
        { source: "something" },
        { resolved: "src/aap/speeltuigen/autoband.ts", exoticRequire: "notUse" }
      )
    ).to.deep.equal({ valid: true });
  });

  it("flags dependencies that are required with a forbidden exotic require", () => {
    expect(
      validate.dependency(
        true,
        readRuleSet("./test/validate/fixtures/rules.exotic-require.json"),
        { source: "something" },
        { resolved: "src/aap/speeltuigen/autoband.ts", exoticRequire: "use" }
      )
    ).to.deep.equal({
      valid: false,
      rules: [{ name: "no-use-as-exotic-require", severity: "warn" }]
    });
  });
});

describe("validate/index - exoticRequireNot", () => {
  it("does not flag dependencies that are required with a regular require or import", () => {
    expect(
      validate.dependency(
        true,
        readRuleSet("./test/validate/fixtures/rules.exotic-require-not.json"),
        { source: "something" },
        { resolved: "src/aap/speeltuigen/autoband.ts" }
      )
    ).to.deep.equal({ valid: true });
  });

  it("does not flag dependencies that are required with a sanctioned exotic require", () => {
    expect(
      validate.dependency(
        true,
        readRuleSet("./test/validate/fixtures/rules.exotic-require-not.json"),
        { source: "something" },
        {
          resolved: "src/aap/speeltuigen/autoband.ts",
          exoticRequire: "use"
        }
      )
    ).to.deep.equal({ valid: true });
  });

  it("flags dependencies are required with an unsanctioned exotic require", () => {
    expect(
      validate.dependency(
        true,
        readRuleSet("./test/validate/fixtures/rules.exotic-require-not.json"),
        { source: "something" },
        {
          resolved: "src/aap/speeltuigen/autoband.ts",
          exoticRequire: "notuse"
        }
      )
    ).to.deep.equal({
      valid: false,
      rules: [{ name: "only-use-as-exotic-require", severity: "warn" }]
    });
  });
});
