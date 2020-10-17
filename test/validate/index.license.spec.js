const { expect } = require("chai");
const validate = require("../../src/validate");
const readRuleSet = require("./readruleset.utl");

describe("validate/index - license", () => {
  it("Skips dependencies that have no license attached", () => {
    expect(
      validate.dependency(
        readRuleSet("./test/validate/fixtures/rules.license.json"),
        { source: "something" },
        { resolved: "src/aap/speeltuigen/autoband.ts" }
      )
    ).to.deep.equal({ valid: true });
  });

  it("does not flag dependencies that do not match the license expression", () => {
    expect(
      validate.dependency(
        readRuleSet("./test/validate/fixtures/rules.license.json"),
        { source: "something" },
        {
          resolved: "src/aap/speeltuigen/autoband.ts",
          license: "Monkey-PL",
        }
      )
    ).to.deep.equal({ valid: true });
  });

  it("flags dependencies that match the license expression", () => {
    expect(
      validate.dependency(
        readRuleSet("./test/validate/fixtures/rules.license.json"),
        { source: "something" },
        {
          resolved: "src/aap/speeltuigen/autoband.ts",
          license: "SomePL-3.1",
        }
      )
    ).to.deep.equal({
      valid: false,
      rules: [{ name: "no-somepl-license", severity: "warn" }],
    });
  });
});

describe("validate/index - licenseNot", () => {
  it("Skips dependencies that have no license attached", () => {
    expect(
      validate.dependency(
        readRuleSet("./test/validate/fixtures/rules.licensenot.json"),
        { source: "something" },
        { resolved: "src/aap/speeltuigen/autoband.ts" }
      )
    ).to.deep.equal({ valid: true });
  });

  it("does not flag dependencies that do match the license expression", () => {
    expect(
      validate.dependency(
        readRuleSet("./test/validate/fixtures/rules.licensenot.json"),
        { source: "something" },
        {
          resolved: "src/aap/speeltuigen/autoband.ts",
          license: "SomePL-3.1",
        }
      )
    ).to.deep.equal({ valid: true });
  });

  it("flags dependencies that do not match the license expression", () => {
    expect(
      validate.dependency(
        readRuleSet("./test/validate/fixtures/rules.licensenot.json"),
        { source: "something" },
        {
          resolved: "src/aap/speeltuigen/autoband.ts",
          license: "Monkey-PL",
        }
      )
    ).to.deep.equal({
      valid: false,
      rules: [{ name: "only-somepl-license", severity: "warn" }],
    });
  });
});
