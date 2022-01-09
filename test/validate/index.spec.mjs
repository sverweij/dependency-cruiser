/* eslint-disable max-statements */
import { expect } from "chai";
import validate from "../../src/validate/index.js";
import readRuleSet from "./readruleset.utl.mjs";

describe("[I] validate/index dependency - generic tests", () => {
  it("is ok with the empty validation", () => {
    expect(
      validate.dependency(
        readRuleSet("./test/validate/__mocks__/rules.empty.json"),
        { source: "koos koets" },
        { resolved: "robby van de kerkhof" }
      )
    ).to.deep.equal({ valid: true });
  });

  it("is ok with the 'everything allowed' validation", () => {
    expect(
      validate.dependency(
        readRuleSet("./test/validate/__mocks__/rules.everything-allowed.json"),
        { source: "koos koets" },
        { resolved: "robby van de kerkhof" }
      )
    ).to.deep.equal({ valid: true });
  });

  it("is ok with the 'everything allowed' validation - even when there's a module only rule in 'forbidden'", () => {
    expect(
      validate.module(
        readRuleSet(
          "./test/validate/__mocks__/rules.module-only.empty.allowed.json"
        ),
        { source: "koos koets" }
      )
    ).to.deep.equal({ valid: true });
  });

  it("is ok with the 'impossible to match allowed' validation", () => {
    expect(
      validate.dependency(
        readRuleSet(
          "./test/validate/__mocks__/rules.impossible-to-match-allowed.json"
        ),
        { source: "koos koets" },
        { resolved: "robby van de kerkhof" }
      )
    ).to.deep.equal({
      valid: false,
      rules: [{ severity: "warn", name: "not-in-allowed" }],
    });
  });

  it("is ok with the 'impossible to match allowed' validation - errors when configured so", () => {
    expect(
      validate.dependency(
        readRuleSet(
          "./test/validate/__mocks__/rules.impossible-to-match-error.allowed.json"
        ),
        { source: "koos koets" },
        { resolved: "robby van de kerkhof" }
      )
    ).to.deep.equal({
      valid: false,
      rules: [{ severity: "error", name: "not-in-allowed" }],
    });
  });

  it("is ok with the 'nothing allowed' validation", () => {
    expect(
      validate.dependency(
        readRuleSet("./test/validate/__mocks__/rules.nothing-allowed.json"),
        { source: "koos koets" },
        { resolved: "robby van de kerkhof" }
      )
    ).to.deep.equal({
      valid: false,
      rules: [{ severity: "warn", name: "unnamed" }],
    });
  });

  it("if there's more than one violated rule, both are returned", () => {
    expect(
      validate.dependency(
        readRuleSet(
          "./test/validate/__mocks__/rules.not-in-allowed-and-a-forbidden.json"
        ),
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
  it("node_modules inhibition - ok", () => {
    expect(
      validate.dependency(
        readRuleSet(
          "./test/validate/__mocks__/rules.node_modules-not-allowed.json"
        ),
        { source: "koos koets" },
        { resolved: "robby van de kerkhof" }
      )
    ).to.deep.equal({ valid: true });
  });

  it("node_modules inhibition - violation", () => {
    expect(
      validate.dependency(
        readRuleSet(
          "./test/validate/__mocks__/rules.node_modules-not-allowed.json"
        ),
        { source: "koos koets" },
        { resolved: "./node_modules/evil-module" }
      )
    ).to.deep.equal({
      valid: false,
      rules: [{ severity: "warn", name: "unnamed" }],
    });
  });

  it("not to core - ok", () => {
    expect(
      validate.dependency(
        readRuleSet("./test/validate/__mocks__/rules.not-to-core.json"),
        { source: "koos koets" },
        { resolved: "path", dependencyTypes: ["npm"] }
      )
    ).to.deep.equal({ valid: true });
  });

  it("not to core - violation", () => {
    expect(
      validate.dependency(
        readRuleSet("./test/validate/__mocks__/rules.not-to-core.json"),
        { source: "koos koets" },
        { resolved: "path", dependencyTypes: ["core"] }
      )
    ).to.deep.equal({
      valid: false,
      rules: [{ severity: "error", name: "not-to-core" }],
    });
  });

  it("not to core fs os - ok", () => {
    expect(
      validate.dependency(
        readRuleSet("./test/validate/__mocks__/rules.not-to-core-fs-os.json"),
        { source: "koos koets" },
        { resolved: "path", dependencyTypes: ["core"] }
      )
    ).to.deep.equal({ valid: true });
  });

  it("not to core fs os - violation", () => {
    expect(
      validate.dependency(
        readRuleSet("./test/validate/__mocks__/rules.not-to-core-fs-os.json"),
        { source: "koos koets" },
        { resolved: "os", dependencyTypes: ["core"] }
      )
    ).to.deep.equal({
      valid: false,
      rules: [{ severity: "error", name: "not-to-core-fs-os" }],
    });
  });

  it("not to unresolvable - ok", () => {
    expect(
      validate.dependency(
        readRuleSet("./test/validate/__mocks__/rules.not-to-unresolvable.json"),
        { source: "koos koets" },
        { resolved: "diana charitee", couldNotResolve: false }
      )
    ).to.deep.equal({ valid: true });
  });

  it("not to unresolvable - violation", () => {
    expect(
      validate.dependency(
        readRuleSet("./test/validate/__mocks__/rules.not-to-unresolvable.json"),
        { source: "koos koets" },
        { resolved: "diana charitee", couldNotResolve: true }
      )
    ).to.deep.equal({
      valid: false,
      rules: [{ severity: "error", name: "not-to-unresolvable" }],
    });
  });

  it("only to core - via 'allowed' - ok", () => {
    expect(
      validate.dependency(
        readRuleSet(
          "./test/validate/__mocks__/rules.only-to-core.allowed.json"
        ),
        { source: "koos koets" },
        { resolved: "os", dependencyTypes: ["core"] }
      )
    ).to.deep.equal({ valid: true });
  });

  it("only to core - with dependencyTypesNot in forbidden - ok", () => {
    expect(
      validate.dependency(
        readRuleSet(
          "./test/validate/__mocks__/rules.only-to-core.allowed-with-forbidden.json"
        ),
        { source: "koos koets" },
        { resolved: "os", dependencyTypes: ["core"] }
      )
    ).to.deep.equal({ valid: true });
  });

  it("only to core - with dependencyTypesNot in forbidden - nok", () => {
    expect(
      validate.dependency(
        readRuleSet(
          "./test/validate/__mocks__/rules.only-to-core.allowed-with-forbidden.json"
        ),
        { source: "koos koets" },
        { resolved: "robbie kerkhof", dependencyTypes: ["local"] }
      )
    ).to.deep.equal({
      valid: false,
      rules: [
        {
          name: "only-to-core",
          severity: "error",
        },
      ],
    });
  });

  it("only to type-only - with dependencyTypesNot in forbidden, multiple types - ok", () => {
    expect(
      validate.dependency(
        readRuleSet(
          "./test/validate/__mocks__/rules.only-to-type-only.allowed-with-forbidden.json"
        ),
        { source: "src/koos-koets.ts" },
        {
          resolved: "src/robbie-kerkhof.ts",
          dependencyTypes: ["type-only", "local"],
        }
      )
    ).to.deep.equal({ valid: true });
  });

  it("only to type-only - with dependencyTypesNot in forbidden, multiple types - nok", () => {
    expect(
      validate.dependency(
        readRuleSet(
          "./test/validate/__mocks__/rules.only-to-type-only.allowed-with-forbidden.json"
        ),
        { source: "src/koos-koets.ts" },
        { resolved: "src/ger-hekking.ts", dependencyTypes: ["local"] }
      )
    ).to.deep.equal({
      valid: false,
      rules: [
        {
          name: "only-to-type-only",
          severity: "error",
        },
      ],
    });
  });

  it("only to core - via 'allowed' - violation", () => {
    expect(
      validate.dependency(
        readRuleSet(
          "./test/validate/__mocks__/rules.only-to-core.allowed.json"
        ),
        { source: "koos koets" },
        { resolved: "ger hekking", dependencyTypes: ["npm"] }
      )
    ).to.deep.equal({
      valid: false,
      rules: [{ severity: "warn", name: "not-in-allowed" }],
    });
  });

  it("only to core - via 'forbidden' - ok", () => {
    expect(
      validate.dependency(
        readRuleSet(
          "./test/validate/__mocks__/rules.only-to-core.forbidden.json"
        ),
        { source: "koos koets" },
        { resolved: "os", dependencyTypes: ["core"] }
      )
    ).to.deep.equal({ valid: true });
  });

  it("only to core - via 'forbidden' - violation", () => {
    expect(
      validate.dependency(
        readRuleSet(
          "./test/validate/__mocks__/rules.only-to-core.forbidden.json"
        ),
        { source: "koos koets" },
        { resolved: "ger hekking", dependencyTypes: ["local"] }
      )
    ).to.deep.equal({
      valid: false,
      rules: [{ severity: "error", name: "only-to-core" }],
    });
  });

  it("not to sub except sub itself - ok - sub to sub", () => {
    expect(
      validate.dependency(
        readRuleSet(
          "./test/validate/__mocks__/rules.not-to-sub-except-sub.json"
        ),
        { source: "./keek/op/de/sub/week.js" },
        { resolved: "./keek/op/de/sub/maand.js", coreModule: false }
      )
    ).to.deep.equal({ valid: true });
  });

  it("not to sub except sub itself - ok - not sub to not sub", () => {
    expect(
      validate.dependency(
        readRuleSet(
          "./test/validate/__mocks__/rules.not-to-sub-except-sub.json"
        ),
        { source: "./doctor/clavan.js" },
        { resolved: "./rochebrune.js", coreModule: false }
      )
    ).to.deep.equal({ valid: true });
  });

  it("not to sub except sub itself - ok - sub to not sub", () => {
    expect(
      validate.dependency(
        readRuleSet(
          "./test/validate/__mocks__/rules.not-to-sub-except-sub.json"
        ),
        { source: "./doctor/sub/clavan.js" },
        { resolved: "./rochebrune.js", coreModule: false }
      )
    ).to.deep.equal({ valid: true });
  });

  it("not to sub except sub itself  - violation - not sub to sub", () => {
    expect(
      validate.dependency(
        readRuleSet(
          "./test/validate/__mocks__/rules.not-to-sub-except-sub.json"
        ),
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
        readRuleSet("./test/validate/__mocks__/rules.not-to-not-sub.json"),
        { source: "./keek/op/de/sub/week.js" },
        { resolved: "./keek/op/de/sub/maand.js", coreModule: false }
      )
    ).to.deep.equal({ valid: true });
  });

  it("not to not sub (=> everything must go to 'sub')- violation - not sub to not sub", () => {
    expect(
      validate.dependency(
        readRuleSet("./test/validate/__mocks__/rules.not-to-not-sub.json"),
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
        readRuleSet("./test/validate/__mocks__/rules.not-to-dev-dep.json"),
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
        readRuleSet("./test/validate/__mocks__/rules.not-to-dev-dep.json"),
        { source: "src/aap/zus/jet.js" },
        {
          module: "jip",
          resolved: "node_modules/jip/janneke.js",
          dependencyTypes: ["npm"],
        }
      )
    ).to.deep.equal({ valid: true });
  });

  it(`no relations with modules of > 1 dep type (e.g. specified 2x in package.json)`, () => {
    expect(
      validate.dependency(
        readRuleSet(
          "./test/validate/__mocks__/rules.no-duplicate-dep-types.json"
        ),
        { source: "src/aap/zus/jet.js" },
        {
          module: "chai",
          resolved: "node_modules/chai/index.js",
          dependencyTypes: ["npm", "npm-dev"],
        }
      )
    ).to.deep.equal({
      valid: false,
      rules: [
        {
          name: "no-duplicate-dep-types",
          severity: "warn",
        },
      ],
    });
  });

  it(`relations with modules of > 1 dep type (e.g. specified in package.json as peer and as dev)`, () => {
    expect(
      validate.dependency(
        readRuleSet(
          "./test/validate/__mocks__/rules.please-duplicate-dep-types.json"
        ),
        { source: "src/aap/zus/jet.js" },
        {
          module: "chai",
          resolved: "node_modules/chai/index.js",
          dependencyTypes: ["npm-peer"],
        }
      )
    ).to.deep.equal({
      valid: false,
      rules: [
        {
          name: "please-duplicate-dep-types",
          severity: "warn",
        },
      ],
    });
  });

  it("moreUnstable: flags when depending on a module that is more unstable (moreUnstable=true, forbidden)", () => {
    expect(
      validate.dependency(
        readRuleSet(
          "./test/validate/__mocks__/rules.stable-dependencies-only-forbidden.json"
        ),
        { source: "something", instability: 0 },
        {
          resolved: "src/some/thing/else.js",
          instability: 1,
        }
      )
    ).to.deep.equal({
      valid: false,
      rules: [{ name: "SDP", severity: "info" }],
    });
  });

  it("moreUnstable: does not flag when depending on a module that is more stable (moreUnstable=true, forbidden)", () => {
    expect(
      validate.dependency(
        readRuleSet(
          "./test/validate/__mocks__/rules.stable-dependencies-only-forbidden.json"
        ),
        { source: "something", instability: 1 },
        {
          resolved: "src/some/thing/else.js",
          instability: 0.1,
        }
      )
    ).to.deep.equal({
      valid: true,
    });
  });

  it("moreUnstable: flags when depending on a module that is more unstable (moreUnstable=false, allowed)", () => {
    expect(
      validate.dependency(
        readRuleSet(
          "./test/validate/__mocks__/rules.stable-dependencies-only-allowed.json"
        ),
        { source: "something", instability: 0 },
        {
          resolved: "src/some/thing/else.js",
          instability: 1,
        }
      )
    ).to.deep.equal({
      valid: false,
      rules: [{ name: "not-in-allowed", severity: "info" }],
    });
  });

  it("moreUnstable: does not flag when depending on a module that is more stable (moreUnstable=false, allowed)", () => {
    expect(
      validate.dependency(
        readRuleSet(
          "./test/validate/__mocks__/rules.stable-dependencies-only-allowed.json"
        ),
        { source: "something", instability: 1 },
        {
          resolved: "src/some/thing/else.js",
          instability: 0.1,
        }
      )
    ).to.deep.equal({
      valid: true,
    });
  });
});
