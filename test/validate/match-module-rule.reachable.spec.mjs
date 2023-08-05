import { strictEqual } from "node:assert";
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
    strictEqual(matchModuleRule.matchesReachableRule(EMPTY_RULE, {}), false);
  });
  it("rule without reachable attribute doesn't match reachables (explicit)", () => {
    strictEqual(
      matchModuleRule.matchesReachableRule(EMPTY_RULE, {
        reachable: [{ value: false, asDefinedInRule: "no-unreachable" }],
      }),
      false,
    );
  });
  it("rule with reachable attribute doesn't match reachables (implicit)", () => {
    strictEqual(
      matchModuleRule.matchesReachableRule(ANY_UNREACHABLE, {}),
      false,
    );
  });
  it("rule with reachable attribute doesn't match reachables (explicit)", () => {
    strictEqual(
      matchModuleRule.matchesReachableRule(ANY_UNREACHABLE, {
        reachable: [{ value: true, asDefinedInRule: "no-unreachable" }],
      }),
      false,
    );
  });
  it("rule with reachable attribute matches unreachables according to that rule name", () => {
    strictEqual(
      matchModuleRule.matchesReachableRule(ANY_UNREACHABLE, {
        reachable: [{ value: false, asDefinedInRule: "no-unreachable" }],
      }),
      true,
    );
  });
  it("rule with reachable attribute does not match unreachables according to other rule name", () => {
    strictEqual(
      matchModuleRule.matchesReachableRule(ANY_UNREACHABLE, {
        reachable: [{ value: false, asDefinedInRule: "other-rule-name" }],
      }),
      false,
    );
  });
  it("nameless rule with reachable attribute does not match unreachables according to other rule name", () => {
    strictEqual(
      matchModuleRule.matchesReachableRule(ANY_UNREACHABLE_IN_ALLOWED_SET, {
        reachable: [{ value: false, asDefinedInRule: "other-rule-name" }],
      }),
      false,
    );
  });
  it("nameless rule with reachable attribute matchs unreachables according to not-in-allowed", () => {
    strictEqual(
      matchModuleRule.matchesReachableRule(ANY_UNREACHABLE_IN_ALLOWED_SET, {
        reachable: [{ value: false, asDefinedInRule: "not-in-allowed" }],
      }),
      true,
    );
  });
  it("rule with reachable attribute & path matches unreachables according to that rule name in that path", () => {
    strictEqual(
      matchModuleRule.matchesReachableRule(ANY_UNREACHABLE_WITH_PATH, {
        source: "src/lalala.ts",
        reachable: [{ value: false, asDefinedInRule: "no-unreachable" }],
      }),
      true,
    );
  });
  it("rule with reachable attribute & path does not match unreachables according to that rule name and not in that path", () => {
    strictEqual(
      matchModuleRule.matchesReachableRule(ANY_UNREACHABLE_WITH_PATH, {
        source: "test/lalala.ts",
        reachable: [{ value: false, asDefinedInRule: "no-unreachable" }],
      }),
      false,
    );
  });
  it("rule with reachable attribute & path matches reachables according to that rule name in that path", () => {
    strictEqual(
      matchModuleRule.matchesReachableRule(ANY_REACHABLE_WITH_PATH, {
        source: "src/lalala.ts",
        reachable: [{ value: true, asDefinedInRule: "no-unreachable" }],
      }),
      true,
    );
  });
  it("rule with reachable attribute & path does not match unreachables according to that rule name in that path (explicit)", () => {
    strictEqual(
      matchModuleRule.matchesReachableRule(ANY_REACHABLE_WITH_PATH, {
        source: "src/lalala.ts",
        reachable: [{ value: false, asDefinedInRule: "no-unreachable" }],
      }),
      false,
    );
  });
  it("rule with reachable attribute & path does not match unreachables according to that rule name in that path (implicit)", () => {
    strictEqual(
      matchModuleRule.matchesReachableRule(ANY_REACHABLE_WITH_PATH, {
        source: "src/lalala.ts",
      }),
      false,
    );
  });
});
