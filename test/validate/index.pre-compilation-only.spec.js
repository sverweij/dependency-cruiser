const expect = require("chai").expect;
const validate = require("../../src/validate");
const readRuleSet = require("./readruleset.utl");

describe("validate/index - preCompilationOnly", () => {
  it("Stuff that still exists after compilation - okeleedokelee", () => {
    expect(
      validate.dependency(
        true,
        readRuleSet("./test/validate/fixtures/rules.pre-compilation-only.json"),
        { source: "something" },
        { resolved: "real-stuff-only.ts", preCompilationOnly: false }
      )
    ).to.deep.equal({ valid: true });
  });

  it("Stuff that only exists before compilation - flaggeleedaggelee", () => {
    expect(
      validate.dependency(
        true,
        readRuleSet("./test/validate/fixtures/rules.pre-compilation-only.json"),
        { source: "something" },
        { resolved: "types.d.ts", preCompilationOnly: true }
      )
    ).to.deep.equal({
      rules: [{ name: "precomp", severity: "warn" }],
      valid: false,
    });
  });
});
