import { expect } from "chai";
import validate from "../../src/validate/index.mjs";
import parseRuleSet from "./parse-ruleset.utl.mjs";

describe("[I] validate/index dependency - generic tests", () => {
  it("is ok with the empty validation", () => {
    const lEmptyRuleSet = parseRuleSet({});
    expect(
      validate.dependency(
        lEmptyRuleSet,
        { source: "koos koets" },
        { resolved: "robby van de kerkhof" }
      )
    ).to.deep.equal({ valid: true });
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
    expect(
      validate.dependency(
        lEverythingAllowedRuleSet,
        { source: "koos koets" },
        { resolved: "robby van de kerkhof" }
      )
    ).to.deep.equal({ valid: true });
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

    expect(validate.module(lRuleSet, { source: "koos koets" })).to.deep.equal({
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

    expect(
      validate.dependency(
        lRuleSet,
        { source: "koos koets" },
        { resolved: "robby van de kerkhof" }
      )
    ).to.deep.equal({
      valid: false,
      rules: [{ severity: "warn", name: "not-in-allowed" }],
    });
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

    expect(
      validate.dependency(
        lRuleSet,
        { source: "koos koets" },
        { resolved: "robby van de kerkhof" }
      )
    ).to.deep.equal({
      valid: false,
      rules: [{ severity: "error", name: "not-in-allowed" }],
    });
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

    expect(
      validate.dependency(
        lRuleSet,
        { source: "koos koets" },
        { resolved: "robby van de kerkhof" }
      )
    ).to.deep.equal({
      valid: false,
      rules: [{ severity: "warn", name: "unnamed" }],
    });
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

    expect(
      validate.dependency(
        lRuleSet,
        { source: "something" },
        {
          resolved: "src/some/thing/else.js",
        }
      )
    ).to.deep.equal({
      valid: false,
      rules: [
        { name: "everything-is-forbidden", severity: "error" },
        { name: "not-in-allowed", severity: "info" },
      ],
    });
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
    expect(
      validate.dependency(
        lNodeModulesNotAllowedRuleSet,
        { source: "koos koets" },
        { resolved: "robby van de kerkhof" }
      )
    ).to.deep.equal({ valid: true });
  });

  it("node_modules inhibition - violation", () => {
    expect(
      validate.dependency(
        lNodeModulesNotAllowedRuleSet,
        { source: "koos koets" },
        { resolved: "./node_modules/evil-module" }
      )
    ).to.deep.equal({
      valid: false,
      rules: [{ severity: "warn", name: "unnamed" }],
    });
  });

  it("not to sub except sub itself - ok - sub to sub", () => {
    expect(
      validate.dependency(
        lNotToSubExceptSubRuleSet,
        { source: "./keek/op/de/sub/week.js" },
        { resolved: "./keek/op/de/sub/maand.js", coreModule: false }
      )
    ).to.deep.equal({ valid: true });
  });

  it("not to sub except sub itself - ok - not sub to not sub", () => {
    expect(
      validate.dependency(
        lNotToSubExceptSubRuleSet,
        { source: "./doctor/clavan.js" },
        { resolved: "./rochebrune.js", coreModule: false }
      )
    ).to.deep.equal({ valid: true });
  });

  it("not to sub except sub itself - ok - sub to not sub", () => {
    expect(
      validate.dependency(
        lNotToSubExceptSubRuleSet,
        { source: "./doctor/sub/clavan.js" },
        { resolved: "./rochebrune.js", coreModule: false }
      )
    ).to.deep.equal({ valid: true });
  });

  it("not to sub except sub itself  - violation - not sub to sub", () => {
    expect(
      validate.dependency(
        lNotToSubExceptSubRuleSet,
        { source: "./doctor/clavan.js" },
        { resolved: "./keek/op/de/sub/week.js", coreModule: false }
      )
    ).to.deep.equal({
      valid: false,
      rules: [{ severity: "error", name: "not-to-sub-except-sub" }],
    });
  });

  it("not to not sub (=> everything must go to 'sub')- ok - sub to sub", () => {
    expect(
      validate.dependency(
        lNotToNotSubRuleSet,
        { source: "./keek/op/de/sub/week.js" },
        { resolved: "./keek/op/de/sub/maand.js", coreModule: false }
      )
    ).to.deep.equal({ valid: true });
  });

  it("not to not sub (=> everything must go to 'sub')- violation - not sub to not sub", () => {
    expect(
      validate.dependency(
        lNotToNotSubRuleSet,
        { source: "./amber.js" },
        { resolved: "./jade.js", coreModule: false }
      )
    ).to.deep.equal({
      valid: false,
      rules: [{ severity: "error", name: "not-to-not-sub" }],
    });
  });

  it("not-to-dev-dep disallows relations to develop dependencies", () => {
    expect(
      validate.dependency(
        lNotToDevelopmentDependencyRuleSet,
        { source: "src/aap/zus/jet.js" },
        {
          module: "chai",
          resolved: "node_modules/chai/index.js",
          dependencyTypes: ["npm-dev"],
        }
      )
    ).to.deep.equal({
      valid: false,
      rules: [
        {
          name: "not-to-dev-dep",
          severity: "error",
        },
      ],
    });
  });

  it("not-to-dev-dep does allow relations to regular dependencies", () => {
    expect(
      validate.dependency(
        lNotToDevelopmentDependencyRuleSet,
        { source: "src/aap/zus/jet.js" },
        {
          module: "jip",
          resolved: "node_modules/jip/janneke.js",
          dependencyTypes: ["npm"],
        }
      )
    ).to.deep.equal({ valid: true });
  });
});
