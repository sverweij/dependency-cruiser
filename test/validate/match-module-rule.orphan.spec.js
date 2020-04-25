const expect = require("chai").expect;
const { matchesOrphanRule } = require("../../src/validate/match-module-rule");

const EMPTY_RULE = { from: {}, to: {} };
const ANY_ORPHAN = { from: { orphan: true }, to: {} };
const ORPHAN_IN_PATH = { from: { orphan: true, path: "^src" }, to: {} };
const ORPHAN_IN_PATH_NOT = { from: { orphan: true, pathNot: "^src" }, to: {} };

describe("validate/match-module-rule - orphan", () => {
  it("rule without orphan attribute doesn't non-orphans (implicit)", () => {
    expect(matchesOrphanRule(EMPTY_RULE, {})).to.equal(false);
  });
  it("rule without orphan attribute doesn't non-orphans (explicit)", () => {
    expect(matchesOrphanRule(EMPTY_RULE, { orphan: false })).to.equal(false);
  });
  it("rule without orphan attribute doesn't match orphan module", () => {
    expect(matchesOrphanRule(EMPTY_RULE, { orphan: true })).to.equal(false);
  });
  it("orphan match rule doesn't match non-orphans", () => {
    expect(matchesOrphanRule(ANY_ORPHAN, {})).to.equal(false);
  });
  it("orphan match rule matches orphans", () => {
    expect(matchesOrphanRule(ANY_ORPHAN, { orphan: true })).to.equal(true);
  });
  it("orphan match rule with path doesn't match orphans in other paths", () => {
    expect(
      matchesOrphanRule(ORPHAN_IN_PATH, {
        orphan: true,
        source: "test/lalal.spec.ts"
      })
    ).to.equal(false);
  });
  it("orphan match rule with path matches orphans in that path", () => {
    expect(
      matchesOrphanRule(ORPHAN_IN_PATH, {
        orphan: true,
        source: "src/lalal.ts"
      })
    ).to.equal(true);
  });
  it("orphan match rule with path matches orphans outside that path", () => {
    expect(
      matchesOrphanRule(ORPHAN_IN_PATH_NOT, {
        orphan: true,
        source: "test/lalal.spec.ts"
      })
    ).to.equal(true);
  });
  it("orphan match rule with pathNot doesn't match orphans in that path", () => {
    expect(
      matchesOrphanRule(ORPHAN_IN_PATH_NOT, {
        orphan: true,
        source: "src/lalal.ts"
      })
    ).to.equal(false);
  });
});
