const { expect } = require("chai");
const { match } = require("~/src/validate/match-module-rule");

const EMPTY_RULE = { from: {}, to: {} };
const ORPHAN_RULE = { from: { orphan: true }, to: {} };

describe("validate/match-module-rule - match", () => {
  it("does not match anything when passed a non-module rule", () => {
    expect(match({})(EMPTY_RULE)).to.equal(false);
  });
  it("does not match anything when passed a non-matchig module rule", () => {
    expect(match({})(ORPHAN_RULE)).to.equal(false);
  });
  it("does not match anything when passed an orphan rule and there's an explicit non-orphan module", () => {
    expect(match({ from: { orphan: false } })(ORPHAN_RULE)).to.equal(false);
  });
  it("matches when passed an orphan rule and there's an explicit non-orphan module", () => {
    expect(match({ from: { orphan: true } })(ORPHAN_RULE)).to.equal(false);
  });
});
