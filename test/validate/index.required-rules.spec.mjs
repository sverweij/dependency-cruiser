import { deepEqual } from "node:assert/strict";
import parseRuleSet from "./parse-ruleset.utl.mjs";
import { validateDependency, validateModule } from "#validate/index.mjs";

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
    deepEqual(
      validateModule(lRequiredRuleSet, {
        source: "something",
      }),
      { valid: true },
    );
  });

  it("modules matching the module criteria with no dependencies bork", () => {
    deepEqual(
      validateModule(lRequiredRuleSet, {
        source: "grub-controller.ts",
        dependencies: [],
      }),
      {
        rules: [{ name: "thou-shalt-inherit-from-base", severity: "warn" }],
        valid: false,
      },
    );
  });

  it("modules matching the module criteria with no matching dependencies bork", () => {
    deepEqual(
      validateModule(lRequiredRuleSet, {
        source: "grub-controller.ts",
        dependencies: [
          {
            resolved: "src/not-the-base-controller.ts",
          },
          {
            resolved: "src/not-the-base-controller-either.ts",
          },
        ],
      }),
      {
        rules: [{ name: "thou-shalt-inherit-from-base", severity: "warn" }],
        valid: false,
      },
    );
  });

  it("'required' violations don't get flagged as dependency transgressions", () => {
    deepEqual(
      validateDependency(lRequiredRuleSet, {
        source: "grub-controller.ts",
        dependencies: [
          {
            resolved: "src/not-the-base-controller.ts",
          },
          {
            resolved: "src/not-the-base-controller-either.ts",
          },
        ],
      }),
      {
        valid: true,
      },
    );
  });

  it("modules matching the module criteria with matching dependencies are okeliedokelie", () => {
    deepEqual(
      validateModule(lRequiredRuleSet, {
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
      }),
      {
        valid: true,
      },
    );
  });
});
