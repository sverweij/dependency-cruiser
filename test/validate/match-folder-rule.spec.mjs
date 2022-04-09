import { expect } from "chai";
import matchFolderRule from "../../src/validate/match-folder-dependency-rule.js";

const EMPTY_RULE = { scope: "folder", from: {}, to: {} };
const SDP_RULE = { scope: "folder", from: {}, to: { moreUnstable: true } };
const CYCLE_RULE = { scope: "folder", from: {}, to: { circular: true } };

describe("[I] validate/match-folder-dependency-rule - match generic", () => {
  it("empty rule => match all the things (empty from & to)", () => {
    expect(matchFolderRule.match({}, {})(EMPTY_RULE)).to.equal(true);
  });
});

describe("[I] validate/match-folder-dependency-rule - match SDP", () => {
  it("rule with a restriction on the to doesn't match when the criterium is not met (data missing)", () => {
    expect(matchFolderRule.match({}, {})(SDP_RULE)).to.equal(false);
  });
  it("rule with a restriction on the to doesn't match when the criterium is not met (data there)", () => {
    expect(
      matchFolderRule.match({ instability: 1 }, { instability: 0 })(SDP_RULE)
    ).to.equal(false);
  });
  it("rule with a restriction on the to matches when the criterium is met (data there)", () => {
    expect(
      matchFolderRule.match({ instability: 0 }, { instability: 1 })(SDP_RULE)
    ).to.equal(true);
  });
});

describe("[I] validate/match-folder-dependency-rule - match cycle", () => {
  it("rule with a restriction on the to doesn't match when the criterium is not met (data missing)", () => {
    expect(matchFolderRule.match({}, {})(CYCLE_RULE)).to.equal(false);
  });
  it("rule with a restriction on the to doesn't match when the criterium is not met (data there)", () => {
    expect(matchFolderRule.match({}, { circular: false })(CYCLE_RULE)).to.equal(
      false
    );
  });
  it("rule with a restriction on the to doesn't match when the criterium is met (data there)", () => {
    expect(matchFolderRule.match({}, { circular: true })(CYCLE_RULE)).to.equal(
      true
    );
  });
});
