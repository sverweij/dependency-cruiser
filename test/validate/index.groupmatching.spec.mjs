import { expect } from "chai";
import validate from "../../src/validate/index.mjs";
import parseRuleSet from "./parse-ruleset.utl.mjs";

describe("[I] validate/index group matching - path group matched in a pathnot", () => {
  const lGroupToPathNotRuleSet = {
    forbidden: [
      {
        name: "group-to-pathnot",
        comment:
          "not to peer folders directly under source (except self and 'shared')",
        from: {
          path: "^src/([^/]+)/.+",
        },
        to: {
          path: "^src/[^/]+/.+",
          pathNot: "^src/($1|shared)/.+",
        },
      },
    ],
  };

  it("group-to-pathnot - Disallows dependencies between peer folders", () => {
    expect(
      validate.dependency(
        parseRuleSet(lGroupToPathNotRuleSet),
        { source: "src/aap/chimpansee.ts" },
        { resolved: "src/noot/pinda.ts" }
      )
    ).to.deep.equal({
      valid: false,
      rules: [
        {
          name: "group-to-pathnot",
          severity: "warn",
        },
      ],
    });
  });

  it("group-to-pathnot - Allows dependencies within to peer folder 'shared'", () => {
    expect(
      validate.dependency(
        parseRuleSet(lGroupToPathNotRuleSet),
        { source: "src/aap/chimpansee.ts" },
        { resolved: "src/shared/bananas.ts" }
      )
    ).to.deep.equal({ valid: true });
  });

  it("group-to-pathnot - Allows dependencies within own folder", () => {
    expect(
      validate.dependency(
        parseRuleSet(lGroupToPathNotRuleSet),
        { source: "src/aap/chimpansee.ts" },
        { resolved: "src/aap/oerangoetang.ts" }
      )
    ).to.deep.equal({ valid: true });
  });

  it("group-to-pathnot - Allows dependencies to sub folders of own folder", () => {
    expect(
      validate.dependency(
        parseRuleSet(lGroupToPathNotRuleSet),
        { source: "src/aap/chimpansee.ts" },
        { resolved: "src/aap/speeltuigen/autoband.ts" }
      )
    ).to.deep.equal({ valid: true });
  });

  it("group-to-pathnot - Allows peer dependencies between sub folders of own folder", () => {
    expect(
      validate.dependency(
        parseRuleSet(lGroupToPathNotRuleSet),
        { source: "src/aap/rekwisieten/touw.ts" },
        { resolved: "src/aap/speeltuigen/autoband.ts" }
      )
    ).to.deep.equal({ valid: true });
  });
});

describe("[I] validate/index group matching - second path group matched in a pathnot", () => {
  const lGroupTwoToPathNotRuleSet = {
    forbidden: [
      {
        name: "group-two-to-pathnot",
        comment:
          "not to peer folders directly under source (except self and 'shared')",
        from: {
          path: "^(src)/([^/]+)/.+",
        },
        to: {
          path: "^src/[^/]+/.+",
          pathNot: "^src/($2|shared)/.+",
        },
      },
    ],
  };

  it("group-two-to-pathnot - Disallows dependencies between peer folders", () => {
    expect(
      validate.dependency(
        parseRuleSet(lGroupTwoToPathNotRuleSet),
        { source: "src/aap/chimpansee.ts" },
        { resolved: "src/noot/pinda.ts" }
      )
    ).to.deep.equal({
      valid: false,
      rules: [
        {
          name: "group-two-to-pathnot",
          severity: "warn",
        },
      ],
    });
  });

  it("group-two-to-pathnot - Allows dependencies within to peer folder 'shared'", () => {
    expect(
      validate.dependency(
        parseRuleSet(lGroupTwoToPathNotRuleSet),
        { source: "src/aap/chimpansee.ts" },
        { resolved: "src/shared/bananas.ts" }
      )
    ).to.deep.equal({ valid: true });
  });

  it("group-two-to-pathnot - Allows dependencies within own folder", () => {
    expect(
      validate.dependency(
        parseRuleSet(lGroupTwoToPathNotRuleSet),
        { source: "src/aap/chimpansee.ts" },
        { resolved: "src/aap/oerangoetang.ts" }
      )
    ).to.deep.equal({ valid: true });
  });

  it("group-two-to-pathnot - Allows dependencies to sub folders of own folder", () => {
    expect(
      validate.dependency(
        parseRuleSet(lGroupTwoToPathNotRuleSet),
        { source: "src/aap/chimpansee.ts" },
        { resolved: "src/aap/speeltuigen/autoband.ts" }
      )
    ).to.deep.equal({ valid: true });
  });

  it("group-two-to-pathnot - Allows peer dependencies between sub folders of own folder", () => {
    expect(
      validate.dependency(
        parseRuleSet(lGroupTwoToPathNotRuleSet),
        { source: "src/aap/rekwisieten/touw.ts" },
        { resolved: "src/aap/speeltuigen/autoband.ts" }
      )
    ).to.deep.equal({ valid: true });
  });
});
