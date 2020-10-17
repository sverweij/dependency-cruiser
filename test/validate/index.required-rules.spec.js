const { expect } = require("chai");
const validate = require("../../src/validate");
const readRuleSet = require("./readruleset.utl");

describe("validate/index - required rules", () => {
  it("modules not matching the module criteria from the required rule are okeliedokelie", () => {
    expect(
      validate.module(
        readRuleSet("./test/validate/fixtures/rules.required.json"),
        { source: "something" }
      )
    ).to.deep.equal({ valid: true });
  });

  it("modules matching the module criteria with no dependencies bork", () => {
    expect(
      validate.module(
        readRuleSet("./test/validate/fixtures/rules.required.json"),
        { source: "grub-controller.ts", dependencies: [] }
      )
    ).to.deep.equal({
      rules: [{ name: "thou-shalt-inherit-from-base", severity: "warn" }],
      valid: false,
    });
  });

  it("modules matching the module criteria with no matching dependencies bork", () => {
    expect(
      validate.module(
        readRuleSet("./test/validate/fixtures/rules.required.json"),
        {
          source: "grub-controller.ts",
          dependencies: [
            {
              resolved: "src/not-the-base-controller.ts",
            },
            {
              resolved: "src/not-the-base-controller-either.ts",
            },
          ],
        }
      )
    ).to.deep.equal({
      rules: [{ name: "thou-shalt-inherit-from-base", severity: "warn" }],
      valid: false,
    });
  });

  it("'required' violations don't get flagged as dependency transgressions", () => {
    expect(
      validate.dependency(
        readRuleSet("./test/validate/fixtures/rules.required.json"),
        {
          source: "grub-controller.ts",
          dependencies: [
            {
              resolved: "src/not-the-base-controller.ts",
            },
            {
              resolved: "src/not-the-base-controller-either.ts",
            },
          ],
        }
      )
    ).to.deep.equal({
      valid: true,
    });
  });

  it("modules matching the module criteria with matching dependencies are okeliedokelie", () => {
    expect(
      validate.module(
        readRuleSet("./test/validate/fixtures/rules.required.json"),
        {
          source: "grub-controller.ts",
          dependencies: [
            {
              resolved: "src/not-the-base-controller.ts",
            },
            {
              resolved: "src/base-controller/index.ts",
            },
            {
              resolved: "src/not-the-base-controller-either.ts",
            },
          ],
        }
      )
    ).to.deep.equal({
      valid: true,
    });
  });
});
