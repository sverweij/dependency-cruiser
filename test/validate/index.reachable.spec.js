const { expect } = require("chai");
const validate = require("../../src/validate");
const readRuleSet = require("./readruleset.utl");

describe("validate/index - reachable (in forbidden set)", () => {
  it("Skips modules that have no reachable attribute (reachable false)", () => {
    expect(
      validate.module(
        readRuleSet("./test/validate/fixtures/rules.reachable-false.json"),
        { source: "something" }
      )
    ).to.deep.equal({ valid: true });
  });

  it("Skips modules that have no reachable attribute (reachable true)", () => {
    expect(
      validate.module(
        readRuleSet("./test/validate/fixtures/rules.reachable-true.json"),
        { source: "something" }
      )
    ).to.deep.equal({ valid: true });
  });

  it("Triggers on modules that have a reachable attribute (non-matching, reachable false)", () => {
    expect(
      validate.module(
        readRuleSet("./test/validate/fixtures/rules.reachable-false.json"),
        {
          source: "something",
          reachable: [{ asDefinedInRule: "no-unreachable", value: true }],
        }
      )
    ).to.deep.equal({ valid: true });
  });

  it("Triggers on modules that have a reachable attribute (non-matching, reachable true)", () => {
    expect(
      validate.module(
        readRuleSet("./test/validate/fixtures/rules.reachable-true.json"),
        {
          source: "something",
          reachable: [{ asDefinedInRule: "no-unreachable", value: true }],
        }
      )
    ).to.deep.equal({ valid: true });
  });

  it("Triggers on modules that have a reachable attribute (reachable false)", () => {
    expect(
      validate.module(
        readRuleSet("./test/validate/fixtures/rules.reachable-false.json"),
        {
          source: "something",
          reachable: [{ asDefinedInRule: "no-unreachable", value: false }],
        }
      )
    ).to.deep.equal({
      valid: false,
      rules: [
        {
          name: "no-unreachable",
          severity: "warn",
        },
      ],
    });
  });

  it("Triggers on modules that have a reachable attribute (reachable true)", () => {
    expect(
      validate.module(
        readRuleSet("./test/validate/fixtures/rules.reachable-true.json"),
        {
          source: "something",
          reachable: [{ asDefinedInRule: "no-reachable", value: true }],
        }
      )
    ).to.deep.equal({
      valid: false,
      rules: [
        {
          name: "no-reachable",
          severity: "warn",
        },
      ],
    });
  });

  it("Triggers on modules that have a reachable attribute (with a path, reachable false)", () => {
    expect(
      validate.module(
        readRuleSet("./test/validate/fixtures/rules.reachable-false.path.json"),
        {
          source: "something",
          reachable: [{ asDefinedInRule: "no-unreachable", value: false }],
        }
      )
    ).to.deep.equal({
      valid: false,
      rules: [
        {
          name: "no-unreachable",
          severity: "warn",
        },
      ],
    });
  });

  it("Triggers on modules that have a reachable attribute (with a path, reachable true)", () => {
    expect(
      validate.module(
        readRuleSet("./test/validate/fixtures/rules.reachable-true.path.json"),
        {
          source: "something",
          reachable: [{ asDefinedInRule: "no-reachable", value: true }],
        }
      )
    ).to.deep.equal({
      valid: false,
      rules: [
        {
          name: "no-reachable",
          severity: "warn",
        },
      ],
    });
  });

  it("Triggers on modules that have a reachable attribute (with a pathNot, reachable false)", () => {
    expect(
      validate.module(
        readRuleSet(
          "./test/validate/fixtures/rules.reachable-false.pathnot.json"
        ),
        {
          source: "something",
          reachable: [{ asDefinedInRule: "no-unreachable", value: false }],
        }
      )
    ).to.deep.equal({ valid: true });
  });

  it("Triggers on modules that have a reachable attribute (with a pathNot, reachable true)", () => {
    expect(
      validate.module(
        readRuleSet(
          "./test/validate/fixtures/rules.reachable-true.pathnot.json"
        ),
        {
          source: "something",
          reachable: [{ asDefinedInRule: "no-reachable", value: true }],
        }
      )
    ).to.deep.equal({ valid: true });
  });
});
describe("validate/index - reachable (in allowed set)", () => {
  it("Triggers on modules that have no reachable attribute ('allowed' rule set)", () => {
    expect(
      validate.module(
        readRuleSet("./test/validate/fixtures/rules.reachable.allowed.json"),
        {
          source: "something",
        }
      )
    ).to.deep.equal({
      valid: false,
      rules: [
        {
          name: "not-in-allowed",
          severity: "warn",
        },
      ],
    });
  });

  it("Skips on modules that have a reachable attribute (match - 'allowed' rule set)", () => {
    expect(
      validate.module(
        readRuleSet("./test/validate/fixtures/rules.reachable.allowed.json"),
        {
          source: "something",
          reachable: [
            {
              value: true,
              asDefinedInRule: "not-in-allowed",
            },
          ],
        }
      )
    ).to.deep.equal({
      valid: true,
    });
  });

  it("Triggers on modules that have a reachable attribute (no match - 'allowed' rule set)", () => {
    expect(
      validate.module(
        readRuleSet("./test/validate/fixtures/rules.reachable.allowed.json"),
        {
          source: "something",
          reachable: [
            {
              value: false,
              asDefinedInRule: "not-in-allowed",
            },
          ],
        }
      )
    ).to.deep.equal({
      valid: false,
      rules: [
        {
          name: "not-in-allowed",
          severity: "warn",
        },
      ],
    });
  });
});
