import { deepEqual } from "node:assert/strict";
import parseRuleSet from "./parse-ruleset.utl.mjs";
import { validateDependency } from "#validate/index.mjs";

describe("[I] validate/index - ancestor", () => {
  const lNoAncestorForbiddenRuleSet = parseRuleSet({
    forbidden: [
      {
        name: "no-ancestor",
        severity: "info",
        from: {},
        to: {
          ancestor: true,
        },
      },
    ],
  });
  const lYesAncestorForbiddenRuleSet = parseRuleSet({
    forbidden: [
      {
        name: "yes-ancestor",
        severity: "info",
        from: {},
        to: {
          ancestor: false,
        },
      },
    ],
  });
  const lNoAncestorAllowedRuleSet = parseRuleSet({
    allowedSeverity: "info",
    allowed: [
      {
        from: {},
        to: {
          ancestor: true,
        },
      },
    ],
  });
  const lYesAncestorAllowedRuleSet = parseRuleSet({
    allowedSeverity: "info",
    allowed: [
      {
        from: {},
        to: {
          ancestor: false,
        },
      },
    ],
  });

  it("ancestor forbidden - violation", () => {
    deepEqual(
      validateDependency(
        lNoAncestorForbiddenRuleSet,
        { source: "src/foo/bar/baz/qux.mjs" },
        { resolved: "src/foo/garply.mjs" },
      ),
      { valid: false, rules: [{ severity: "info", name: "no-ancestor" }] },
    );
  });

  it("ancestor forbidden - passing", () => {
    deepEqual(
      validateDependency(
        lNoAncestorForbiddenRuleSet,
        { source: "src/foo/bar/baz/qux.mjs" },
        { resolved: "src/foo/bar/baz/waldo.mjs" },
      ),
      { valid: true },
    );
  });

  it("non-ancestor forbidden - violation", () => {
    deepEqual(
      validateDependency(
        lYesAncestorForbiddenRuleSet,
        { source: "src/foo/bar/baz/qux.mjs" },
        { resolved: "src/foo/bar/baz/waldo.mjs" },
      ),
      { valid: false, rules: [{ severity: "info", name: "yes-ancestor" }] },
    );
  });
  it("non-ancestor forbidden - passing", () => {
    deepEqual(
      validateDependency(
        lYesAncestorForbiddenRuleSet,
        { source: "src/foo/bar/baz/qux.mjs" },
        { resolved: "src/foo/garply.mjs" },
      ),
      { valid: true },
    );
  });
  it("ancestor allowed - passing", () => {
    deepEqual(
      validateDependency(
        lNoAncestorAllowedRuleSet,
        { source: "src/foo/bar/baz/qux.mjs" },
        { resolved: "src/foo/garply.mjs" },
      ),
      { valid: true },
    );
  });
  it("ancestor allowed - violation", () => {
    deepEqual(
      validateDependency(
        lNoAncestorAllowedRuleSet,
        { source: "src/foo/bar/baz/qux.mjs" },
        { resolved: "src/foo/bar/baz/waldo.mjs" },
      ),
      { valid: false, rules: [{ severity: "info", name: "not-in-allowed" }] },
    );
  });
  it("non-ancestor allowed - passing", () => {
    deepEqual(
      validateDependency(
        lYesAncestorAllowedRuleSet,
        { source: "src/foo/bar/baz/qux.mjs" },
        { resolved: "src/foo/bar/baz/waldo.mjs" },
      ),
      { valid: true },
    );
  });
  it("non-ancestor allowed - violation", () => {
    deepEqual(
      validateDependency(
        lYesAncestorAllowedRuleSet,
        { source: "src/foo/bar/baz/qux.mjs" },
        { resolved: "src/foo/garply.mjs" },
      ),
      { valid: false, rules: [{ severity: "info", name: "not-in-allowed" }] },
    );
  });
});
