import { expect } from "chai";
import matchFolderRule from "../../src/validate/match-folder-dependency-rule.js";

describe("[I] validate/match-folder-dependency-rule - match generic", () => {
  const lEmptyRule = { scope: "folder", from: {}, to: {} };

  it("empty rule => match all the things (empty from & to)", () => {
    expect(matchFolderRule.match({}, {})(lEmptyRule)).to.equal(true);
  });
});

describe("[I] validate/match-folder-dependency-rule - match SDP", () => {
  const lSdpRule = { scope: "folder", from: {}, to: { moreUnstable: true } };

  it("rule with a restriction on the to doesn't match when the criterium is not met (data missing)", () => {
    expect(matchFolderRule.match({}, {})(lSdpRule)).to.equal(false);
  });
  it("rule with a restriction on the to doesn't match when the criterium is not met (data there)", () => {
    expect(
      matchFolderRule.match({ instability: 1 }, { instability: 0 })(lSdpRule)
    ).to.equal(false);
  });
  it("rule with a restriction on the to matches when the criterium is met (data there)", () => {
    expect(
      matchFolderRule.match({ instability: 0 }, { instability: 1 })(lSdpRule)
    ).to.equal(true);
  });
});

describe("[I] validate/match-folder-dependency-rule - match cycle", () => {
  const lCycleRule = { scope: "folder", from: {}, to: { circular: true } };

  it("rule with a restriction on the to doesn't match when the criterium is not met (data missing)", () => {
    expect(matchFolderRule.match({}, {})(lCycleRule)).to.equal(false);
  });
  it("rule with a restriction on the to doesn't match when the criterium is not met (data there)", () => {
    expect(matchFolderRule.match({}, { circular: false })(lCycleRule)).to.equal(
      false
    );
  });
  it("rule with a restriction on the to doesn't match when the criterium is met (data there)", () => {
    expect(matchFolderRule.match({}, { circular: true })(lCycleRule)).to.equal(
      true
    );
  });
});

describe("[I] validate/match-folder-dependency-rule - match from path", () => {
  const lPathRule = { scope: "folder", from: { path: "src/" }, to: {} };

  it("does not match folders not in the from path of the rule", () => {
    expect(
      matchFolderRule.match({ name: "test/shouldnotmatch" }, {})(lPathRule)
    ).to.equal(false);
  });
  it("does match folders in the from path of the rule", () => {
    expect(
      matchFolderRule.match({ name: "src/shouldmatch" }, {})(lPathRule)
    ).to.equal(true);
  });
});

describe("[I] validate/match-folder-dependency-rule - match from pathNot", () => {
  const lPathNotRule = { scope: "folder", from: { pathNot: "src/" }, to: {} };

  it("does not match folders in the from pathNot of the rule", () => {
    expect(
      matchFolderRule.match({ name: "src/shouldnotmatch" }, {})(lPathNotRule)
    ).to.equal(false);
  });
  it("does match folders in the from pathNot of the rule", () => {
    expect(
      matchFolderRule.match({ name: "test/shouldmatch" }, {})(lPathNotRule)
    ).to.equal(true);
  });
});

describe("[I] validate/match-folder-dependency-rule - match to path", () => {
  const lPathRule = { scope: "folder", from: {}, to: { path: "src/" } };

  it("does not match folders not in the from path of the rule", () => {
    expect(
      matchFolderRule.match({}, { name: "test/shouldnotmatch" })(lPathRule)
    ).to.equal(false);
  });
  it("does match folders in the from path of the rule", () => {
    expect(
      matchFolderRule.match({}, { name: "src/shouldmatch" })(lPathRule)
    ).to.equal(true);
  });
});

describe("[I] validate/match-folder-dependency-rule - match to pathNot", () => {
  const lPathNotRule = { scope: "folder", from: {}, to: { pathNot: "src/" } };

  it("does not match folders in the from pathNot of the rule", () => {
    expect(
      matchFolderRule.match({}, { name: "src/shouldnotmatch" })(lPathNotRule)
    ).to.equal(false);
  });
  it("does match folders in the from pathNot of the rule", () => {
    expect(
      matchFolderRule.match({}, { name: "test/shouldmatch" })(lPathNotRule)
    ).to.equal(true);
  });
});
