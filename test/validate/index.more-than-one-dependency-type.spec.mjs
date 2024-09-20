import { deepEqual } from "node:assert/strict";
import parseRuleSet from "./parse-ruleset.utl.mjs";
import { validateDependency } from "#validate/index.mjs";

describe("[I] index/validate - moreThanOneDependencyType", () => {
  it(`no relations with modules of > 1 dep type (e.g. specified 2x in package.json)`, () => {
    const lRuleSet = parseRuleSet({
      forbidden: [
        {
          name: "no-duplicate-dep-types",
          severity: "warn",
          from: {},
          to: { moreThanOneDependencyType: true },
        },
      ],
    });

    deepEqual(
      validateDependency(
        lRuleSet,
        { source: "src/aap/zus/jet.js" },
        {
          module: "sneeze",
          resolved: "node_modules/sneeze/index.js",
          dependencyTypes: ["npm", "npm-dev"],
        },
      ),
      {
        valid: false,
        rules: [
          {
            name: "no-duplicate-dep-types",
            severity: "warn",
          },
        ],
      },
    );
  });

  it(`relations with modules of > 1 dep type (e.g. specified in package.json as peer and as dev)`, () => {
    const lRuleSet = parseRuleSet({
      forbidden: [
        {
          name: "please-duplicate-dep-types",
          severity: "warn",
          from: {},
          to: { moreThanOneDependencyType: false },
        },
      ],
    });

    deepEqual(
      validateDependency(
        lRuleSet,
        { source: "src/aap/zus/jet.js" },
        {
          module: "sneeze",
          resolved: "node_modules/sneeze/index.js",
          dependencyTypes: ["npm-peer"],
        },
      ),
      {
        valid: false,
        rules: [
          {
            name: "please-duplicate-dep-types",
            severity: "warn",
          },
        ],
      },
    );
  });
  it("ignores aliases in counting dependency types", () => {
    const lRuleSet = parseRuleSet({
      forbidden: [
        {
          name: "please-duplicate-dep-types",
          severity: "warn",
          from: {},
          to: { moreThanOneDependencyType: true },
        },
      ],
    });

    deepEqual(
      validateDependency(
        lRuleSet,
        { source: "src/aap/zus/jet.js" },
        {
          module: "sneeze",
          resolved: "node_modules/sneeze/index.js",
          dependencyTypes: ["local", "aliased", "aliased-subpath-import"],
        },
      ),
      {
        valid: true,
      },
    );
  });
  it("ignores type-only in counting dependency types", () => {
    const lRuleSet = parseRuleSet({
      forbidden: [
        {
          name: "please-duplicate-dep-types",
          severity: "warn",
          from: {},
          to: { moreThanOneDependencyType: true },
        },
      ],
    });

    deepEqual(
      validateDependency(
        lRuleSet,
        { source: "src/aap/zus/jet.js" },
        {
          module: "sneeze",
          resolved: "node_modules/sneeze/index.js",
          dependencyTypes: ["npm-dev", "type-only"],
        },
      ),
      {
        valid: true,
      },
    );
  });
});
