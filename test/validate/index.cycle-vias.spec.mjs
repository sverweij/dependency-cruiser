/* eslint-disable max-statements */
import { expect } from "chai";
import validate from "../../src/validate/index.js";
import readRuleSet from "./readruleset.utl.mjs";

describe("validate/index dependency - cycle viaNot", () => {
  it("a => ba => bb => bc => a get flagged when none of them is in a viaNot", () => {
    expect(
      validate.dependency(
        readRuleSet("./test/validate/fixtures/rules.cycle.via-not.json"),
        { source: "tmp/a.js" },
        {
          resolved: "tmp/ba.js",
          circular: true,
          cycle: ["tmp/ba.js", "tmp/bb.js", "tmp/bc.js", "tmp/a.js"],
        }
      )
    ).to.deep.equal({
      valid: false,
      rules: [{ name: "unnamed", severity: "warn" }],
    });
  });

  it("a => aa => ab => ac => a doesn't get flagged when one of them is in a viaNot", () => {
    expect(
      validate.dependency(
        readRuleSet("./test/validate/fixtures/rules.cycle.via-not.json"),
        { source: "tmp/a.js" },
        {
          resolved: "tmp/aa.js",
          circular: true,
          cycle: ["tmp/aa.js", "tmp/ab.js", "tmp/ac.js", "tmp/a.js"],
        }
      )
    ).to.deep.equal({
      valid: true,
    });
  });
});

describe("validate/index dependency - cycle via", () => {
  it("a => ba => bb => bc => a doesn't get flagged when none of them is in a via", () => {
    expect(
      validate.dependency(
        readRuleSet("./test/validate/fixtures/rules.cycle.via.json"),
        { source: "tmp/a.js" },
        {
          resolved: "tmp/ba.js",
          circular: true,
          cycle: ["tmp/ba.js", "tmp/bb.js", "tmp/bc.js", "tmp/a.js"],
        }
      )
    ).to.deep.equal({
      valid: true,
    });
  });

  it("a => aa => ab => ac => a get flagged when one of them is in a via", () => {
    expect(
      validate.dependency(
        readRuleSet("./test/validate/fixtures/rules.cycle.via.json"),
        { source: "tmp/a.js" },
        {
          resolved: "tmp/aa.js",
          circular: true,
          cycle: ["tmp/aa.js", "tmp/ab.js", "tmp/ac.js", "tmp/a.js"],
        }
      )
    ).to.deep.equal({
      valid: false,
      rules: [{ name: "unnamed", severity: "warn" }],
    });
  });
});
