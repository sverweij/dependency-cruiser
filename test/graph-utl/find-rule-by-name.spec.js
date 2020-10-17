/* eslint-disable no-unused-expressions */
const { expect } = require("chai");
const findRuleByName = require("../../src/graph-utl/find-rule-by-name");

describe("utl/findRuleByName", () => {
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
    // eslint-disable-next-line no-undefined
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
