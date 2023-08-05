/* eslint-disable no-undefined  */
import { deepStrictEqual, strictEqual } from "node:assert";
import { describe, it } from "node:test";
import {
  findRuleByName,
  ruleSetHasLicenseRule,
  ruleSetHasDeprecationRule,
} from "../../src/graph-utl/rule-set.mjs";

describe("[U] graph-utl/rule-set - findRuleByName", () => {
  const lRuleSet = {
    forbidden: [{ name: "a-rule", severity: "warn", from: {}, to: {} }],
  };

  it("returns undefined for null rule set/ null rule name", () => {
    strictEqual(findRuleByName(null, null), undefined);
  });
  it("returns undefined for empty rule set/ null rule name", () => {
    strictEqual(findRuleByName({}, null), undefined);
  });
  it("returns undefined for empty rule set/ non-null rule name", () => {
    strictEqual(findRuleByName({}, "non-null-rule-name"), undefined);
  });
  it("returns undefined for undefined rule set/ non-null rule name", () => {
    strictEqual(findRuleByName(undefined, "non-null-rule-name"), undefined);
  });
  it("returns undefined if the rule is not in there", () => {
    strictEqual(findRuleByName(lRuleSet, "another-rule"), undefined);
  });
  it("returns the rule if the rule is in there", () => {
    deepStrictEqual(findRuleByName(lRuleSet, "a-rule"), {
      name: "a-rule",
      severity: "warn",
      from: {},
      to: {},
    });
  });
});

describe("[U] graph-utl/rule-set - ruleSetHasLicenseRule", () => {
  it("returns false for an empty rule set", () => {
    strictEqual(ruleSetHasLicenseRule({}), false);
  });
  it("returns false when rule set no rules with license-like attributes", () => {
    strictEqual(
      ruleSetHasLicenseRule({
        forbidden: [{ from: {}, to: {} }],
        allowed: [{ from: {}, to: {} }],
      }),
      false
    );
  });
  it("returns true when rule set has a forbidden rule with a license attribute", () => {
    strictEqual(
      ruleSetHasLicenseRule({
        forbidden: [{ from: {}, to: { license: "commercial" } }],
      }),
      true
    );
  });
  it("returns true when rule set doesn't have a forbidden rule with license like attributes", () => {
    strictEqual(
      ruleSetHasLicenseRule({
        forbidden: [{ from: {}, to: { licenseNot: "" } }],
      }),
      true
    );
  });
  it("returns true when rule set has a forbidden rule with a licenseNot attribute", () => {
    strictEqual(
      ruleSetHasLicenseRule({
        forbidden: [{ from: {}, to: { licenseNot: "MIT" } }],
      }),
      true
    );
  });
  it("returns true when rule set has an allowed rule with a license attribute", () => {
    strictEqual(
      ruleSetHasLicenseRule({
        allowed: [{ from: {}, to: { license: "commercial" } }],
      }),
      true
    );
  });
  it("returns true when rule set has an allowed rule with a licenseNot attribute", () => {
    strictEqual(
      ruleSetHasLicenseRule({
        allowed: [{ from: {}, to: { licenseNot: "MIT" } }],
      }),
      true
    );
  });
});

describe("[U] graph-utl/rule-set - ruleSetHasDeprecation", () => {
  it("returns false for an empty rule set", () => {
    strictEqual(ruleSetHasDeprecationRule({}), false);
  });
  it("returns false when rule set no rules with license-like attributes", () => {
    strictEqual(
      ruleSetHasDeprecationRule({
        forbidden: [{ from: {}, to: { dependencyTypes: ["npm"] } }],
        allowed: [{ from: {}, to: {} }],
      }),
      false
    );
  });
  it("returns true when there's a 'forbidden' rule that checks for external module deprecation", () => {
    strictEqual(
      ruleSetHasDeprecationRule({
        forbidden: [{ from: {}, to: { dependencyTypes: ["deprecated"] } }],
        allowed: [{ from: {}, to: {} }],
      }),
      true
    );
  });
  it("returns true when there's an 'allowed' rule that checks for external module deprecation", () => {
    strictEqual(
      ruleSetHasDeprecationRule({
        forbidden: [{ from: {}, to: {} }],
        allowed: [{ from: {}, to: { dependencyTypes: ["deprecated"] } }],
      }),
      true
    );
  });
});
