import { strictEqual } from "node:assert";
import matchModuleRule from "../../src/validate/match-module-rule.mjs";

const EMPTY_RULE = { from: {}, to: {} };
const ANY_ORPHAN = { from: { orphan: true }, to: {} };
const ORPHAN_IN_PATH = { from: { orphan: true, path: "^src" }, to: {} };
const ORPHAN_IN_PATH_NOT = { from: { orphan: true, pathNot: "^src" }, to: {} };

describe("[I] validate/match-module-rule - orphan", () => {
  it("rule without orphan attribute doesn't non-orphans (implicit)", () => {
    strictEqual(matchModuleRule.matchesOrphanRule(EMPTY_RULE, {}), false);
  });
  it("rule without orphan attribute doesn't non-orphans (explicit)", () => {
    strictEqual(
      matchModuleRule.matchesOrphanRule(EMPTY_RULE, { orphan: false }),
      false,
    );
  });
  it("rule without orphan attribute doesn't match orphan module", () => {
    strictEqual(
      matchModuleRule.matchesOrphanRule(EMPTY_RULE, { orphan: true }),
      false,
    );
  });
  it("orphan match rule doesn't match non-orphans", () => {
    strictEqual(matchModuleRule.matchesOrphanRule(ANY_ORPHAN, {}), false);
  });
  it("orphan match rule matches orphans", () => {
    strictEqual(
      matchModuleRule.matchesOrphanRule(ANY_ORPHAN, { orphan: true }),
      true,
    );
  });
  it("orphan match rule with path doesn't match orphans in other paths", () => {
    strictEqual(
      matchModuleRule.matchesOrphanRule(ORPHAN_IN_PATH, {
        orphan: true,
        source: "test/lalal.spec.ts",
      }),
      false,
    );
  });
  it("orphan match rule with path matches orphans in that path", () => {
    strictEqual(
      matchModuleRule.matchesOrphanRule(ORPHAN_IN_PATH, {
        orphan: true,
        source: "src/lalal.ts",
      }),
      true,
    );
  });
  it("orphan match rule with path matches orphans outside that path", () => {
    strictEqual(
      matchModuleRule.matchesOrphanRule(ORPHAN_IN_PATH_NOT, {
        orphan: true,
        source: "test/lalal.spec.ts",
      }),
      true,
    );
  });
  it("orphan match rule with pathNot doesn't match orphans in that path", () => {
    strictEqual(
      matchModuleRule.matchesOrphanRule(ORPHAN_IN_PATH_NOT, {
        orphan: true,
        source: "src/lalal.ts",
      }),
      false,
    );
  });
});
