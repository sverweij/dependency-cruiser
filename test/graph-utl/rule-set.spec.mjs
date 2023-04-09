/* eslint-disable no-unused-expressions */
import { expect } from "chai";
import {
  findRuleByName,
  ruleSetHasLicenseRule,
  ruleSetHasDeprecationRule,
} from "../../src/graph-utl/rule-set.mjs";

describe("[U] graph-utl/rule-set - findRuleByName", () => {
  const lRuleSet = {
    forbidden: [{ name: "a-rule", severity: "warn", from: {}, to: {} }],
  };

  it("returns undefined for null rule set/ null rule name", () => {
    expect(findRuleByName(null, null)).to.be.undefined;
  });
  it("returns undefined for empty rule set/ null rule name", () => {
    expect(findRuleByName({}, null)).to.be.undefined;
  });
  it("returns undefined for empty rule set/ non-null rule name", () => {
    expect(findRuleByName({}, "non-null-rule-name")).to.be.undefined;
  });
  it("returns undefined for undefined rule set/ non-null rule name", () => {
    // eslint-disable-next-line no-undefined
    expect(findRuleByName(undefined, "non-null-rule-name")).to.be.undefined;
  });
  it("returns undefined if the rule is not in there", () => {
    expect(findRuleByName(lRuleSet, "another-rule")).to.be.undefined;
  });
  it("returns the rule if the rule is in there", () => {
    expect(findRuleByName(lRuleSet, "a-rule")).to.deep.equal({
      name: "a-rule",
      severity: "warn",
      from: {},
      to: {},
    });
  });
});

describe("[U] graph-utl/rule-set - ruleSetHasLicenseRule", () => {
  it("returns false for an empty rule set", () => {
    expect(ruleSetHasLicenseRule({})).to.equal(false);
  });
  it("returns false when rule set no rules with license-like attributes", () => {
    expect(
      ruleSetHasLicenseRule({
        forbidden: [{ from: {}, to: {} }],
        allowed: [{ from: {}, to: {} }],
      })
    ).to.equal(false);
  });
  it("returns true when rule set has a forbidden rule with a license attribute", () => {
    expect(
      ruleSetHasLicenseRule({
        forbidden: [{ from: {}, to: { license: "commercial" } }],
      })
    ).to.equal(true);
  });
  it("returns true when rule set doesn't have a forbidden rule with license like attributes", () => {
    expect(
      ruleSetHasLicenseRule({
        forbidden: [{ from: {}, to: { licenseNot: "" } }],
      })
    ).to.equal(true);
  });
  it("returns true when rule set has a forbidden rule with a licenseNot attribute", () => {
    expect(
      ruleSetHasLicenseRule({
        forbidden: [{ from: {}, to: { licenseNot: "MIT" } }],
      })
    ).to.equal(true);
  });
  it("returns true when rule set has an allowed rule with a license attribute", () => {
    expect(
      ruleSetHasLicenseRule({
        allowed: [{ from: {}, to: { license: "commercial" } }],
      })
    ).to.equal(true);
  });
  it("returns true when rule set has an allowed rule with a licenseNot attribute", () => {
    expect(
      ruleSetHasLicenseRule({
        allowed: [{ from: {}, to: { licenseNot: "MIT" } }],
      })
    ).to.equal(true);
  });
});

describe("[U] graph-utl/rule-set - ruleSetHasDeprecation", () => {
  it("returns false for an empty rule set", () => {
    expect(ruleSetHasDeprecationRule({})).to.equal(false);
  });
  it("returns false when rule set no rules with license-like attributes", () => {
    expect(
      ruleSetHasDeprecationRule({
        forbidden: [{ from: {}, to: { dependencyTypes: ["npm"] } }],
        allowed: [{ from: {}, to: {} }],
      })
    ).to.equal(false);
  });
  it("returns true when there's a 'forbidden' rule that checks for external module deprecation", () => {
    expect(
      ruleSetHasDeprecationRule({
        forbidden: [{ from: {}, to: { dependencyTypes: ["deprecated"] } }],
        allowed: [{ from: {}, to: {} }],
      })
    ).to.equal(true);
  });
  it("returns true when there's an 'allowed' rule that checks for external module deprecation", () => {
    expect(
      ruleSetHasDeprecationRule({
        forbidden: [{ from: {}, to: {} }],
        allowed: [{ from: {}, to: { dependencyTypes: ["deprecated"] } }],
      })
    ).to.equal(true);
  });
});
