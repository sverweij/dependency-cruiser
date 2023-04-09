import { expect } from "chai";
import validate from "../../src/validate/index.mjs";
import parseRuleSet from "./parse-ruleset.utl.mjs";

describe("[I] validate/index - license", () => {
  const lLicenseRuleSet = parseRuleSet({
    forbidden: [
      {
        name: "no-somepl-license",
        from: {},
        to: { license: "SomePL" },
      },
    ],
  });

  it("Skips dependencies that have no license attached", () => {
    expect(
      validate.dependency(
        lLicenseRuleSet,
        { source: "something" },
        { resolved: "src/aap/speeltuigen/autoband.ts" }
      )
    ).to.deep.equal({ valid: true });
  });

  it("does not flag dependencies that do not match the license expression", () => {
    expect(
      validate.dependency(
        lLicenseRuleSet,
        { source: "something" },
        {
          resolved: "src/aap/speeltuigen/autoband.ts",
          license: "Monkey-PL",
        }
      )
    ).to.deep.equal({ valid: true });
  });

  it("flags dependencies that match the license expression", () => {
    expect(
      validate.dependency(
        lLicenseRuleSet,
        { source: "something" },
        {
          resolved: "src/aap/speeltuigen/autoband.ts",
          license: "SomePL-3.1",
        }
      )
    ).to.deep.equal({
      valid: false,
      rules: [{ name: "no-somepl-license", severity: "warn" }],
    });
  });
});

describe("[I] validate/index - licenseNot", () => {
  const lLicenseNotRuleSet = parseRuleSet({
    forbidden: [
      {
        name: "only-somepl-license",
        from: {},
        to: { licenseNot: "SomePL" },
      },
    ],
  });

  it("Skips dependencies that have no license attached", () => {
    expect(
      validate.dependency(
        lLicenseNotRuleSet,
        { source: "something" },
        { resolved: "src/aap/speeltuigen/autoband.ts" }
      )
    ).to.deep.equal({ valid: true });
  });

  it("does not flag dependencies that do match the license expression", () => {
    expect(
      validate.dependency(
        lLicenseNotRuleSet,
        { source: "something" },
        {
          resolved: "src/aap/speeltuigen/autoband.ts",
          license: "SomePL-3.1",
        }
      )
    ).to.deep.equal({ valid: true });
  });

  it("flags dependencies that do not match the license expression", () => {
    expect(
      validate.dependency(
        lLicenseNotRuleSet,
        { source: "something" },
        {
          resolved: "src/aap/speeltuigen/autoband.ts",
          license: "Monkey-PL",
        }
      )
    ).to.deep.equal({
      valid: false,
      rules: [{ name: "only-somepl-license", severity: "warn" }],
    });
  });
});
