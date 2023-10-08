import { equal } from "node:assert/strict";
import matchModuleRule from "#validate/match-module-rule.mjs";

const EMPTY_RULE = { from: {}, to: {} };
const ORPHAN_RULE = { from: { orphan: true }, to: {} };

describe("[I] validate/match-module-rule - match", () => {
  it("does not match anything when passed a non-module rule", () => {
    equal(matchModuleRule.match({})(EMPTY_RULE), false);
  });
  it("does not match anything when passed a non-matchig module rule", () => {
    equal(matchModuleRule.match({})(ORPHAN_RULE), false);
  });
  it("does not match anything when passed an orphan rule and there's an explicit non-orphan module", () => {
    equal(
      matchModuleRule.match({ from: { orphan: false } })(ORPHAN_RULE),
      false,
    );
  });
  it("matches when passed an orphan rule and there's an explicit non-orphan module", () => {
    equal(
      matchModuleRule.match({ from: { orphan: true } })(ORPHAN_RULE),
      false,
    );
  });
});
