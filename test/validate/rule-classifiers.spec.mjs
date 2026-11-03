import { equal, throws } from "node:assert/strict";
import {
  isFolderScope,
  isModuleOnlyRule,
} from "#validate/rule-classifiers.mjs";

describe("[U] validate/rule-classifiers", () => {
  describe("isModuleOnlyRule", () => {
    it("returns false for a rule without module-only selectors", () => {
      equal(isModuleOnlyRule({}), false);
    });

    it("returns true for an orphan selector", () => {
      equal(isModuleOnlyRule({ from: { orphan: true } }), true);
    });

    it("returns true for a reachable selector", () => {
      equal(isModuleOnlyRule({ to: { reachable: true } }), true);
    });

    it("returns true for a module selector", () => {
      equal(isModuleOnlyRule({ module: true }), true);
    });

    it("throws for a null rule", () => {
      throws(() => isModuleOnlyRule(null), TypeError);
    });
  });

  describe("isFolderScope", () => {
    it("returns false for a rule without folder scope", () => {
      equal(isFolderScope({}), false);
    });

    it("returns true for folder scope", () => {
      equal(isFolderScope({ scope: "folder" }), true);
    });

    it("returns false for a null rule", () => {
      equal(isFolderScope(null), false);
    });
  });
});
