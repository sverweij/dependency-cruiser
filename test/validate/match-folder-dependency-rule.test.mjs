import { strictEqual } from "node:assert";
import { describe, it } from "node:test";
import matchFolderRule from "../../src/validate/match-folder-dependency-rule.mjs";

describe("[I] validate/match-folder-dependency-rule - match generic", () => {
  const lEmptyRule = { scope: "folder", from: {}, to: {} };

  it("empty rule => match all the things (empty from & to)", () => {
    strictEqual(matchFolderRule.match({}, {})(lEmptyRule), true);
  });
});

describe("[I] validate/match-folder-dependency-rule - match SDP", () => {
  const lSdpRule = { scope: "folder", from: {}, to: { moreUnstable: true } };

  it("rule with a restriction on the to doesn't match when the criterium is not met (data missing)", () => {
    strictEqual(matchFolderRule.match({}, {})(lSdpRule), false);
  });
  it("rule with a restriction on the to doesn't match when the criterium is not met (data there)", () => {
    strictEqual(
      matchFolderRule.match({ instability: 1 }, { instability: 0 })(lSdpRule),
      false
    );
  });
  it("rule with a restriction on the to matches when the criterium is met (data there)", () => {
    strictEqual(
      matchFolderRule.match({ instability: 0 }, { instability: 1 })(lSdpRule),
      true
    );
  });
});

describe("[I] validate/match-folder-dependency-rule - match cycle", () => {
  const lCycleRule = { scope: "folder", from: {}, to: { circular: true } };

  it("rule with a restriction on the to doesn't match when the criterium is not met (data missing)", () => {
    strictEqual(matchFolderRule.match({}, {})(lCycleRule), false);
  });
  it("rule with a restriction on the to doesn't match when the criterium is not met (data there)", () => {
    strictEqual(
      matchFolderRule.match({}, { circular: false })(lCycleRule),
      false
    );
  });
  it("rule with a restriction on the to doesn't match when the criterium is met (data there)", () => {
    strictEqual(
      matchFolderRule.match({}, { circular: true })(lCycleRule),
      true
    );
  });
});

describe("[I] validate/match-folder-dependency-rule - match from path", () => {
  const lPathRule = { scope: "folder", from: { path: "src/" }, to: {} };

  it("does not match folders not in the from path of the rule", () => {
    strictEqual(
      matchFolderRule.match({ name: "test/shouldnotmatch" }, {})(lPathRule),
      false
    );
  });
  it("does match folders in the from path of the rule", () => {
    strictEqual(
      matchFolderRule.match({ name: "src/shouldmatch" }, {})(lPathRule),
      true
    );
  });
});

describe("[I] validate/match-folder-dependency-rule - match from pathNot", () => {
  const lPathNotRule = { scope: "folder", from: { pathNot: "src/" }, to: {} };

  it("does not match folders in the from pathNot of the rule", () => {
    strictEqual(
      matchFolderRule.match({ name: "src/shouldnotmatch" }, {})(lPathNotRule),
      false
    );
  });
  it("does match folders in the from pathNot of the rule", () => {
    strictEqual(
      matchFolderRule.match({ name: "test/shouldmatch" }, {})(lPathNotRule),
      true
    );
  });
});

describe("[I] validate/match-folder-dependency-rule - match to path", () => {
  const lPathRule = { scope: "folder", from: {}, to: { path: "src/" } };
  const lGroupMatchingPathRule = {
    scope: "folder",
    from: {
      path: "src/components/[^/]+",
    },
    to: { path: "src/components/", pathNot: "src/components/$1" },
  };

  it("does not match folders not in the from path of the rule", () => {
    strictEqual(
      matchFolderRule.match({}, { name: "test/shouldnotmatch" })(lPathRule),
      false
    );
  });
  it("does not match folders not in the from path of the rule (group matching variant)", () => {
    strictEqual(
      matchFolderRule.match(
        { name: "src/components/thing" },
        { name: "test/components/other-thing" }
      )(lGroupMatchingPathRule),
      false
    );
  });
  it("does match folders in the from path of the rule", () => {
    strictEqual(
      matchFolderRule.match({}, { name: "src/shouldmatch" })(lPathRule),
      true
    );
  });
  it("does match folders in the from path of the rule (group matching variant - matching one, not the other)", () => {
    strictEqual(
      matchFolderRule.match(
        { name: "src/components/thing" },
        { name: "src/components/thing/folder-in-thing" }
      )(lGroupMatchingPathRule),
      true
    );
  });
  it("does not match folders in the from path of the rule (group matching  - not matching any)", () => {
    strictEqual(
      matchFolderRule.match(
        { name: "src/components/thing" },
        { name: "src/not-even-a-component" }
      )(lGroupMatchingPathRule),
      false
    );
  });
});

describe("[I] validate/match-folder-dependency-rule - match to pathNot", () => {
  const lPathNotRule = { scope: "folder", from: {}, to: { pathNot: "src/" } };

  it("does not match folders in the from pathNot of the rule", () => {
    strictEqual(
      matchFolderRule.match({}, { name: "src/shouldnotmatch" })(lPathNotRule),
      false
    );
  });
  it("does match folders in the from pathNot of the rule", () => {
    strictEqual(
      matchFolderRule.match({}, { name: "test/shouldmatch" })(lPathNotRule),
      true
    );
  });
});
