const expect = require("chai").expect;
const validate = require("../../src/validate");
const readRuleSet = require("./readruleset.utl");

describe("validate/index group matching - path group matched in a pathnot", () => {
  it("group-to-pathnot - Disallows dependencies between peer folders", () => {
    expect(
      validate.dependency(
        true,
        readRuleSet("./test/validate/fixtures/rules.group-to-pathnot.json"),
        { source: "src/aap/chimpansee.ts" },
        { resolved: "src/noot/pinda.ts" }
      )
    ).to.deep.equal({
      valid: false,
      rules: [
        {
          name: "group-to-pathnot",
          severity: "warn"
        }
      ]
    });
  });

  it("group-to-pathnot - Allows dependencies within to peer folder 'shared'", () => {
    expect(
      validate.dependency(
        true,
        readRuleSet("./test/validate/fixtures/rules.group-to-pathnot.json"),
        { source: "src/aap/chimpansee.ts" },
        { resolved: "src/shared/bananas.ts" }
      )
    ).to.deep.equal({ valid: true });
  });

  it("group-to-pathnot - Allows dependencies within own folder", () => {
    expect(
      validate.dependency(
        true,
        readRuleSet("./test/validate/fixtures/rules.group-to-pathnot.json"),
        { source: "src/aap/chimpansee.ts" },
        { resolved: "src/aap/oerangoetang.ts" }
      )
    ).to.deep.equal({ valid: true });
  });

  it("group-to-pathnot - Allows dependencies to sub folders of own folder", () => {
    expect(
      validate.dependency(
        true,
        readRuleSet("./test/validate/fixtures/rules.group-to-pathnot.json"),
        { source: "src/aap/chimpansee.ts" },
        { resolved: "src/aap/speeltuigen/autoband.ts" }
      )
    ).to.deep.equal({ valid: true });
  });

  it("group-to-pathnot - Allows peer dependencies between sub folders of own folder", () => {
    expect(
      validate.dependency(
        true,
        readRuleSet("./test/validate/fixtures/rules.group-to-pathnot.json"),
        { source: "src/aap/rekwisieten/touw.ts" },
        { resolved: "src/aap/speeltuigen/autoband.ts" }
      )
    ).to.deep.equal({ valid: true });
  });
});

describe("validate/index group matching - second path group matched in a pathnot", () => {
  it("group-two-to-pathnot - Disallows dependencies between peer folders", () => {
    expect(
      validate.dependency(
        true,
        readRuleSet("./test/validate/fixtures/rules.group-two-to-pathnot.json"),
        { source: "src/aap/chimpansee.ts" },
        { resolved: "src/noot/pinda.ts" }
      )
    ).to.deep.equal({
      valid: false,
      rules: [
        {
          name: "group-two-to-pathnot",
          severity: "warn"
        }
      ]
    });
  });

  it("group-two-to-pathnot - Allows dependencies within to peer folder 'shared'", () => {
    expect(
      validate.dependency(
        true,
        readRuleSet("./test/validate/fixtures/rules.group-two-to-pathnot.json"),
        { source: "src/aap/chimpansee.ts" },
        { resolved: "src/shared/bananas.ts" }
      )
    ).to.deep.equal({ valid: true });
  });

  it("group-two-to-pathnot - Allows dependencies within own folder", () => {
    expect(
      validate.dependency(
        true,
        readRuleSet("./test/validate/fixtures/rules.group-two-to-pathnot.json"),
        { source: "src/aap/chimpansee.ts" },
        { resolved: "src/aap/oerangoetang.ts" }
      )
    ).to.deep.equal({ valid: true });
  });

  it("group-two-to-pathnot - Allows dependencies to sub folders of own folder", () => {
    expect(
      validate.dependency(
        true,
        readRuleSet("./test/validate/fixtures/rules.group-two-to-pathnot.json"),
        { source: "src/aap/chimpansee.ts" },
        { resolved: "src/aap/speeltuigen/autoband.ts" }
      )
    ).to.deep.equal({ valid: true });
  });

  it("group-two-to-pathnot - Allows peer dependencies between sub folders of own folder", () => {
    expect(
      validate.dependency(
        true,
        readRuleSet("./test/validate/fixtures/rules.group-two-to-pathnot.json"),
        { source: "src/aap/rekwisieten/touw.ts" },
        { resolved: "src/aap/speeltuigen/autoband.ts" }
      )
    ).to.deep.equal({ valid: true });
  });
});
