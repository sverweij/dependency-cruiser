import { deepEqual } from "node:assert/strict";
import validate from "../../src/validate/index.mjs";
import parseRuleSet from "./parse-ruleset.utl.mjs";

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
      validate.dependency(
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
      validate.dependency(
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
});
