import { expect } from "chai";
import matchModuleRule from "../../src/validate/match-module-rule.mjs";

const EMPTY_RULE = { from: {}, to: {} };
const ANY_UNREACHABLE = {
  name: "no-unreachable",
  from: {},
  to: { reachable: false },
};
const ANY_UNREACHABLE_WITH_PATH = {
  name: "no-unreachable",
  from: {},
  to: { reachable: false, path: "^src" },
};
const ANY_REACHABLE_WITH_PATH = {
  name: "no-unreachable",
  from: {},
  to: { reachable: true, path: "^src" },
};
const ANY_UNREACHABLE_IN_ALLOWED_SET = {
  name: "not-in-allowed",
  from: {},
  to: { reachable: false },
};

describe("[I] validate/match-module-rule - reachable", () => {
  it("rule without reachable attribute doesn't match reachables (implicit)", () => {
    expect(matchModuleRule.matchesReachableRule(EMPTY_RULE, {})).to.equal(
      false
    );
  });
  it("rule without reachable attribute doesn't match reachables (explicit)", () => {
    expect(
      matchModuleRule.matchesReachableRule(EMPTY_RULE, {
        reachable: [{ value: false, asDefinedInRule: "no-unreachable" }],
      })
    ).to.equal(false);
  });
  it("rule with reachable attribute doesn't match reachables (implicit)", () => {
    expect(matchModuleRule.matchesReachableRule(ANY_UNREACHABLE, {})).to.equal(
      false
    );
  });
  it("rule with reachable attribute doesn't match reachables (explicit)", () => {
    expect(
      matchModuleRule.matchesReachableRule(ANY_UNREACHABLE, {
        reachable: [{ value: true, asDefinedInRule: "no-unreachable" }],
      })
    ).to.equal(false);
  });
  it("rule with reachable attribute matches unreachables according to that rule name", () => {
    expect(
      matchModuleRule.matchesReachableRule(ANY_UNREACHABLE, {
        reachable: [{ value: false, asDefinedInRule: "no-unreachable" }],
      })
    ).to.equal(true);
  });
  it("rule with reachable attribute does not match unreachables according to other rule name", () => {
    expect(
      matchModuleRule.matchesReachableRule(ANY_UNREACHABLE, {
        reachable: [{ value: false, asDefinedInRule: "other-rule-name" }],
      })
    ).to.equal(false);
  });
  it("nameless rule with reachable attribute does not match unreachables according to other rule name", () => {
    expect(
      matchModuleRule.matchesReachableRule(ANY_UNREACHABLE_IN_ALLOWED_SET, {
        reachable: [{ value: false, asDefinedInRule: "other-rule-name" }],
      })
    ).to.equal(false);
  });
  it("nameless rule with reachable attribute matchs unreachables according to not-in-allowed", () => {
    expect(
      matchModuleRule.matchesReachableRule(ANY_UNREACHABLE_IN_ALLOWED_SET, {
        reachable: [{ value: false, asDefinedInRule: "not-in-allowed" }],
      })
    ).to.equal(true);
  });
  it("rule with reachable attribute & path matches unreachables according to that rule name in that path", () => {
    expect(
      matchModuleRule.matchesReachableRule(ANY_UNREACHABLE_WITH_PATH, {
        source: "src/lalala.ts",
        reachable: [{ value: false, asDefinedInRule: "no-unreachable" }],
      })
    ).to.equal(true);
  });
  it("rule with reachable attribute & path does not match unreachables according to that rule name and not in that path", () => {
    expect(
      matchModuleRule.matchesReachableRule(ANY_UNREACHABLE_WITH_PATH, {
        source: "test/lalala.ts",
        reachable: [{ value: false, asDefinedInRule: "no-unreachable" }],
      })
    ).to.equal(false);
  });
  it("rule with reachable attribute & path matches reachables according to that rule name in that path", () => {
    expect(
      matchModuleRule.matchesReachableRule(ANY_REACHABLE_WITH_PATH, {
        source: "src/lalala.ts",
        reachable: [{ value: true, asDefinedInRule: "no-unreachable" }],
      })
    ).to.equal(true);
  });
  it("rule with reachable attribute & path does not match unreachables according to that rule name in that path (explicit)", () => {
    expect(
      matchModuleRule.matchesReachableRule(ANY_REACHABLE_WITH_PATH, {
        source: "src/lalala.ts",
        reachable: [{ value: false, asDefinedInRule: "no-unreachable" }],
      })
    ).to.equal(false);
  });
  it("rule with reachable attribute & path does not match unreachables according to that rule name in that path (implicit)", () => {
    expect(
      matchModuleRule.matchesReachableRule(ANY_REACHABLE_WITH_PATH, {
        source: "src/lalala.ts",
      })
    ).to.equal(false);
  });
});
