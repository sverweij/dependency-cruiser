import { expect } from "chai";
import validate from "../../src/validate/index.mjs";
import parseRuleSet from "./parse-ruleset.utl.mjs";

describe("[I] validate/index - required rules", () => {
  const lRequiredRuleSet = parseRuleSet({
    required: [
      {
        name: "thou-shalt-inherit-from-base",
        module: {
          path: ".+-controller\\.ts$",
          pathNot: "random-trials",
        },
        to: {
          path: "src/base-controller/index\\.ts$",
        },
      },
    ],
  });

  it("modules not matching the module criteria from the required rule are okeliedokelie", () => {
    expect(
      validate.module(lRequiredRuleSet, {
        source: "something",
      })
    ).to.deep.equal({ valid: true });
  });

  it("modules matching the module criteria with no dependencies bork", () => {
    expect(
      validate.module(lRequiredRuleSet, {
        source: "grub-controller.ts",
        dependencies: [],
      })
    ).to.deep.equal({
      rules: [{ name: "thou-shalt-inherit-from-base", severity: "warn" }],
      valid: false,
    });
  });

  it("modules matching the module criteria with no matching dependencies bork", () => {
    expect(
      validate.module(lRequiredRuleSet, {
        source: "grub-controller.ts",
        dependencies: [
          {
            resolved: "src/not-the-base-controller.ts",
          },
          {
            resolved: "src/not-the-base-controller-either.ts",
          },
        ],
      })
    ).to.deep.equal({
      rules: [{ name: "thou-shalt-inherit-from-base", severity: "warn" }],
      valid: false,
    });
  });

  it("'required' violations don't get flagged as dependency transgressions", () => {
    expect(
      validate.dependency(lRequiredRuleSet, {
        source: "grub-controller.ts",
        dependencies: [
          {
            resolved: "src/not-the-base-controller.ts",
          },
          {
            resolved: "src/not-the-base-controller-either.ts",
          },
        ],
      })
    ).to.deep.equal({
      valid: true,
    });
  });

  it("modules matching the module criteria with matching dependencies are okeliedokelie", () => {
    expect(
      validate.module(lRequiredRuleSet, {
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
      })
    ).to.deep.equal({
      valid: true,
    });
  });
});
