import { expect } from "chai";
import matchModuleRule from "../../src/validate/match-module-rule.js";

const EMPTY_RULE = { from: {}, to: {} };
const ORPHAN_RULE = { from: { orphan: true }, to: {} };

describe("validate/match-module-rule - match", () => {
  it("does not match anything when passed a non-module rule", () => {
    expect(matchModuleRule.match({})(EMPTY_RULE)).to.equal(false);
  });
  it("does not match anything when passed a non-matchig module rule", () => {
    expect(matchModuleRule.match({})(ORPHAN_RULE)).to.equal(false);
  });
  it("does not match anything when passed an orphan rule and there's an explicit non-orphan module", () => {
    expect(
      matchModuleRule.match({ from: { orphan: false } })(ORPHAN_RULE)
    ).to.equal(false);
  });
  it("matches when passed an orphan rule and there's an explicit non-orphan module", () => {
    expect(
      matchModuleRule.match({ from: { orphan: true } })(ORPHAN_RULE)
    ).to.equal(false);
  });
});
