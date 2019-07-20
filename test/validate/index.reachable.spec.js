const expect = require("chai").expect;
const validate = require("../../src/validate");
const _readRuleSet = require("./readruleset.utl");

describe("validate/index - reachable", () => {
  it("Skips modules that have no reachable attribute", () => {
    expect(
      validate.module(
        true,
        _readRuleSet("./test/validate/fixtures/rules.reachable.json"),
        { source: "something" }
      )
    ).to.deep.equal({ valid: true });
  });

  it("Triggers on modules that have a reachable attribute (non-matching)", () => {
    expect(
      validate.module(
        true,
        _readRuleSet("./test/validate/fixtures/rules.reachable.json"),
        {
          source: "something",
          reachable: [{ asDefinedInRule: "no-unreachable", value: true }]
        }
      )
    ).to.deep.equal({ valid: true });
  });

  it("Triggers on modules that have a reachable attribute", () => {
    expect(
      validate.module(
        true,
        _readRuleSet("./test/validate/fixtures/rules.reachable.json"),
        {
          source: "something",
          reachable: [{ asDefinedInRule: "no-unreachable", value: false }]
        }
      )
    ).to.deep.equal({
      valid: false,
      rules: [
        {
          name: "no-unreachable",
          severity: "warn"
        }
      ]
    });
  });

  it("Triggers on modules that have a reachable attribute (with a path)", () => {
    expect(
      validate.module(
        true,
        _readRuleSet("./test/validate/fixtures/rules.reachable.path.json"),
        {
          source: "something",
          reachable: [{ asDefinedInRule: "no-unreachable", value: false }]
        }
      )
    ).to.deep.equal({
      valid: false,
      rules: [
        {
          name: "no-unreachable",
          severity: "warn"
        }
      ]
    });
  });

  it("Triggers on modules that have a reachable attribute (with a pathNot)", () => {
    expect(
      validate.module(
        true,
        _readRuleSet("./test/validate/fixtures/rules.reachable.pathnot.json"),
        {
          source: "something",
          reachable: [{ asDefinedInRule: "no-unreachable", value: false }]
        }
      )
    ).to.deep.equal({ valid: true });
  });

  it("Skips modules that have no reachable attribute ('allowed' rule set)", () => {
    expect(
      validate.module(
        true,
        _readRuleSet("./test/validate/fixtures/rules.reachable.allowed.json"),
        { source: "something" }
      )
    ).to.deep.equal({ valid: true });
  });

  it("Triggers on modules that have a reachable attribute (match - 'allowed' rule set)", () => {
    expect(
      validate.module(
        true,
        _readRuleSet("./test/validate/fixtures/rules.reachable.allowed.json"),
        {
          source: "something",
          reachable: [{ value: true, asDefinedInRule: "not-in-allowed" }]
        }
      )
    ).to.deep.equal({ valid: true });
  });

  it("Triggers on modules that have a reachable attribute (no match - 'allowed' rule set)", () => {
    expect(
      validate.module(
        true,
        _readRuleSet("./test/validate/fixtures/rules.reachable.allowed.json"),
        {
          source: "something",
          reachable: [{ value: false, asDefinedInRule: "not-in-allowed" }]
        }
      )
    ).to.deep.equal({
      valid: false,
      rules: [
        {
          name: "not-in-allowed",
          severity: "warn"
        }
      ]
    });
  });
});
