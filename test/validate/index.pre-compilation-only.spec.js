const expect = require("chai").expect;
const readRuleSet = require("./readruleset.utl");
const validate = require("~/src/validate");

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

  it("Unknown whether stuff that only exists before compilation - okeleedokelee", () => {
    expect(
      validate.dependency(
        true,
        readRuleSet("./test/validate/fixtures/rules.pre-compilation-only.json"),
        { source: "something" },
        { resolved: "types.d.ts" }
      )
    ).to.deep.equal({ valid: true });
  });
});
