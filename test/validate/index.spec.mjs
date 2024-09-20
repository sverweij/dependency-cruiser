import { deepEqual } from "node:assert/strict";
import parseRuleSet from "./parse-ruleset.utl.mjs";
import { validateDependency, validateModule } from "#validate/index.mjs";

describe("[I] validate/index dependency - generic tests", () => {
  it("is ok with the empty validation", () => {
    const lEmptyRuleSet = parseRuleSet({});
    deepEqual(
      validateDependency(
        lEmptyRuleSet,
        { source: "koos koets" },
        { resolved: "robby van de kerkhof" },
      ),
      { valid: true },
    );
  });

  it("is ok with the 'everything allowed' validation", () => {
    const lEverythingAllowedRuleSet = parseRuleSet({
      allowed: [
        {
          from: {},
          to: {},
        },
      ],
    });
    deepEqual(
      validateDependency(
        lEverythingAllowedRuleSet,
        { source: "koos koets" },
        { resolved: "robby van de kerkhof" },
      ),
      { valid: true },
    );
  });

  it("is ok with the 'everything allowed' validation - even when there's a module only rule in 'forbidden'", () => {
    const lRuleSet = parseRuleSet({
      allowed: [
        {
          from: {},
          to: {},
        },
      ],
      forbidden: [
        {
          name: "no-orphans",
          from: { orphan: true },
          to: {},
        },
      ],
    });

    deepEqual(validateModule(lRuleSet, { source: "koos koets" }), {
      valid: true,
    });
  });

  it("is ok with the 'impossible to match allowed' validation", () => {
    const lRuleSet = parseRuleSet({
      allowed: [
        {
          from: {
            path: "only-this-one",
          },
          to: {
            path: "only-that-one",
          },
        },
      ],
    });

    deepEqual(
      validateDependency(
        lRuleSet,
        { source: "koos koets" },
        { resolved: "robby van de kerkhof" },
      ),
      {
        valid: false,
        rules: [{ severity: "warn", name: "not-in-allowed" }],
      },
    );
  });

  it("is ok with the 'impossible to match allowed' validation - errors when configured so", () => {
    const lRuleSet = parseRuleSet({
      allowed: [
        {
          from: {
            path: "only-this-one",
          },
          to: {
            path: "only-that-one",
          },
        },
      ],
      allowedSeverity: "error",
    });

    deepEqual(
      validateDependency(
        lRuleSet,
        { source: "koos koets" },
        { resolved: "robby van de kerkhof" },
      ),
      {
        valid: false,
        rules: [{ severity: "error", name: "not-in-allowed" }],
      },
    );
  });

  it("is ok with the 'nothing allowed' validation", () => {
    const lRuleSet = parseRuleSet({
      forbidden: [
        {
          from: {},
          to: {
            path: ".+",
          },
        },
      ],
    });

    deepEqual(
      validateDependency(
        lRuleSet,
        { source: "koos koets" },
        { resolved: "robby van de kerkhof" },
      ),
      {
        valid: false,
        rules: [{ severity: "warn", name: "unnamed" }],
      },
    );
  });

  it("if there's more than one violated rule, both are returned", () => {
    const lRuleSet = parseRuleSet({
      forbidden: [
        {
          severity: "error",
          name: "everything-is-forbidden",
          from: {},
          to: {},
        },
      ],
      allowedSeverity: "info",
      allowed: [
        {
          from: {},
          to: { path: "does-not-exist" },
        },
      ],
    });

    deepEqual(
      validateDependency(
        lRuleSet,
        { source: "something" },
        {
          resolved: "src/some/thing/else.js",
        },
      ),
      {
        valid: false,
        rules: [
          { name: "everything-is-forbidden", severity: "error" },
          { name: "not-in-allowed", severity: "info" },
        ],
      },
    );
  });
});

describe("[I] validate/index - specific tests", () => {
  const lNodeModulesNotAllowedRuleSet = parseRuleSet({
    allowed: [
      {
        from: {},
        to: {},
      },
    ],
    forbidden: [
      {
        from: {},
        to: {
          path: "node_modules",
        },
      },
    ],
  });
  const lNotToSubExceptSubRuleSet = parseRuleSet({
    forbidden: [
      {
        name: "not-to-sub-except-sub",
        severity: "error",
        comment:
          "everything to paths containing 'sub' is forbidden - except when the path contains 'sub' itself ",
        from: {
          pathNot: "/sub/",
        },
        to: {
          path: "/sub/",
        },
      },
    ],
  });
  const lNotToNotSubRuleSet = parseRuleSet({
    forbidden: [
      {
        name: "not-to-not-sub",
        severity: "error",
        comment: "everything to paths not containing 'sub' is forbidden",
        from: {},
        to: {
          pathNot: "sub",
        },
      },
    ],
  });
  const lNotToDevelopmentDependencyRuleSet = parseRuleSet({
    forbidden: [
      {
        name: "not-to-dev-dep",
        severity: "error",
        from: {},
        to: { dependencyTypes: ["npm-dev"] },
      },
    ],
  });

  it("node_modules inhibition - ok", () => {
    deepEqual(
      validateDependency(
        lNodeModulesNotAllowedRuleSet,
        { source: "koos koets" },
        { resolved: "robby van de kerkhof" },
      ),
      { valid: true },
    );
  });

  it("node_modules inhibition - violation", () => {
    deepEqual(
      validateDependency(
        lNodeModulesNotAllowedRuleSet,
        { source: "koos koets" },
        { resolved: "./node_modules/evil-module" },
      ),
      {
        valid: false,
        rules: [{ severity: "warn", name: "unnamed" }],
      },
    );
  });

  it("not to sub except sub itself - ok - sub to sub", () => {
    deepEqual(
      validateDependency(
        lNotToSubExceptSubRuleSet,
        { source: "./keek/op/de/sub/week.js" },
        { resolved: "./keek/op/de/sub/maand.js", coreModule: false },
      ),
      { valid: true },
    );
  });

  it("not to sub except sub itself - ok - not sub to not sub", () => {
    deepEqual(
      validateDependency(
        lNotToSubExceptSubRuleSet,
        { source: "./doctor/clavan.js" },
        { resolved: "./rochebrune.js", coreModule: false },
      ),
      { valid: true },
    );
  });

  it("not to sub except sub itself - ok - sub to not sub", () => {
    deepEqual(
      validateDependency(
        lNotToSubExceptSubRuleSet,
        { source: "./doctor/sub/clavan.js" },
        { resolved: "./rochebrune.js", coreModule: false },
      ),
      { valid: true },
    );
  });

  it("not to sub except sub itself  - violation - not sub to sub", () => {
    deepEqual(
      validateDependency(
        lNotToSubExceptSubRuleSet,
        { source: "./doctor/clavan.js" },
        { resolved: "./keek/op/de/sub/week.js", coreModule: false },
      ),
      {
        valid: false,
        rules: [{ severity: "error", name: "not-to-sub-except-sub" }],
      },
    );
  });

  it("not to not sub (=> everything must go to 'sub')- ok - sub to sub", () => {
    deepEqual(
      validateDependency(
        lNotToNotSubRuleSet,
        { source: "./keek/op/de/sub/week.js" },
        { resolved: "./keek/op/de/sub/maand.js", coreModule: false },
      ),
      { valid: true },
    );
  });

  it("not to not sub (=> everything must go to 'sub')- violation - not sub to not sub", () => {
    deepEqual(
      validateDependency(
        lNotToNotSubRuleSet,
        { source: "./amber.js" },
        { resolved: "./jade.js", coreModule: false },
      ),
      {
        valid: false,
        rules: [{ severity: "error", name: "not-to-not-sub" }],
      },
    );
  });

  it("not-to-dev-dep disallows relations to develop dependencies", () => {
    deepEqual(
      validateDependency(
        lNotToDevelopmentDependencyRuleSet,
        { source: "src/aap/zus/jet.js" },
        {
          module: "some-module",
          resolved: "node_modules/some-module/index.js",
          dependencyTypes: ["npm-dev"],
        },
      ),
      {
        valid: false,
        rules: [
          {
            name: "not-to-dev-dep",
            severity: "error",
          },
        ],
      },
    );
  });

  it("not-to-dev-dep does allow relations to regular dependencies", () => {
    deepEqual(
      validateDependency(
        lNotToDevelopmentDependencyRuleSet,
        { source: "src/aap/zus/jet.js" },
        {
          module: "jip",
          resolved: "node_modules/jip/janneke.js",
          dependencyTypes: ["npm"],
        },
      ),
      { valid: true },
    );
  });
});
