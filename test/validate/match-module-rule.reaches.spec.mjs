import { equal } from "node:assert/strict";
import { matchesReachesRule } from "#validate/match-module-rule-helpers.mjs";

const EMPTY_RULE = { from: {}, to: {} };
const ANY_REACHABLE = {
  name: "no-unreachable",
  from: {},
  to: { reachable: true },
};
const ANY_REACHES_IN_ALLOWED = {
  name: "not-in-allowed",
  from: {},
  to: { reachable: true },
};

describe("[I] validate/match-module-rule - reaches", () => {
  it("rule without reachable attribute doesn't match modules with a reaches (implicit)", () => {
    equal(matchesReachesRule(EMPTY_RULE, {}), false);
  });
  it("rule without reachable attribute doesn't match modules with a reaches (explicit)", () => {
    equal(
      matchesReachesRule(EMPTY_RULE, {
        reaches: [
          {
            modules: [{ source: "src/hoppetee.js" }],
            asDefinedInRule: "no-unreachable",
          },
        ],
      }),
      false,
    );
  });
  it("rule without reachable attribute matches modules with a reaches (explicit)", () => {
    equal(
      matchesReachesRule(ANY_REACHABLE, {
        reaches: [
          {
            modules: [{ source: "src/hoppetee.js" }],
            asDefinedInRule: "no-unreachable",
          },
        ],
      }),
      true,
    );
  });
  it("rule without reachable attribute matches modules with a reaches (explicit, nameless rule)", () => {
    equal(
      matchesReachesRule(ANY_REACHES_IN_ALLOWED, {
        reaches: [
          {
            modules: [{ source: "src/hoppetee.js" }],
            asDefinedInRule: "not-in-allowed",
          },
        ],
      }),
      true,
    );
  });
});
