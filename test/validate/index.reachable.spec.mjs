import { deepEqual } from "node:assert/strict";
import validate from "../../src/validate/index.mjs";
import parseRuleSet from "./parse-ruleset.utl.mjs";

describe("[I] validate/index - reachable (in forbidden set)", () => {
  const lReachableFalseRuleSet = parseRuleSet({
    forbidden: [
      {
        name: "no-unreachable",
        from: { path: "src/index\\.js" },
        to: { reachable: false },
      },
    ],
  });
  const lReachableTrueRuleSet = parseRuleSet({
    forbidden: [
      {
        name: "no-reachable",
        from: { path: "src/index\\.js" },
        to: { reachable: true },
      },
    ],
  });
  it("Skips modules that have no reachable attribute (reachable false)", () => {
    deepEqual(
      validate.module(lReachableFalseRuleSet, { source: "something" }),
      { valid: true },
    );
  });

  it("Skips modules that have no reachable attribute (reachable true)", () => {
    deepEqual(validate.module(lReachableTrueRuleSet, { source: "something" }), {
      valid: true,
    });
  });

  it("Triggers on modules that have a reachable attribute (non-matching, reachable false)", () => {
    deepEqual(
      validate.module(lReachableFalseRuleSet, {
        source: "something",
        reachable: [
          {
            asDefinedInRule: "no-unreachable",
            matchedFrom: "azazel",
            value: true,
          },
        ],
      }),
      { valid: true },
    );
  });

  it("Triggers on modules that have a reachable attribute (non-matching, reachable true)", () => {
    deepEqual(
      validate.module(lReachableTrueRuleSet, {
        source: "something",
        reachable: [
          {
            asDefinedInRule: "no-unreachable",
            matchedFrom: "azazel",
            value: true,
          },
        ],
      }),
      { valid: true },
    );
  });

  it("Triggers on modules that have a reachable attribute (reachable false)", () => {
    deepEqual(
      validate.module(lReachableFalseRuleSet, {
        source: "something",
        reachable: [
          {
            asDefinedInRule: "no-unreachable",
            matchedFrom: "azazel",
            value: false,
          },
        ],
      }),
      {
        valid: false,
        rules: [
          {
            name: "no-unreachable",
            severity: "warn",
          },
        ],
      },
    );
  });

  it("Triggers on modules that have a reachable attribute (reachable true)", () => {
    deepEqual(
      validate.module(lReachableTrueRuleSet, {
        source: "something",
        reachable: [
          {
            asDefinedInRule: "no-reachable",
            matchedFrom: "azazel",
            value: true,
          },
        ],
      }),
      {
        valid: false,
        rules: [
          {
            name: "no-reachable",
            severity: "warn",
          },
        ],
      },
    );
  });

  it("Triggers on modules that have a reachable attribute (with a path, reachable false)", () => {
    deepEqual(
      validate.module(lReachableFalseRuleSet, {
        source: "something",
        reachable: [
          {
            asDefinedInRule: "no-unreachable",
            matchedFrom: "azazel",
            value: false,
          },
        ],
      }),
      {
        valid: false,
        rules: [
          {
            name: "no-unreachable",
            severity: "warn",
          },
        ],
      },
    );
  });

  it("Triggers on modules that have a reachable attribute (with a path, reachable true)", () => {
    deepEqual(
      validate.module(lReachableTrueRuleSet, {
        source: "something",
        reachable: [
          {
            asDefinedInRule: "no-reachable",
            matchedFrom: "azazel",
            value: true,
          },
        ],
      }),
      {
        valid: false,
        rules: [
          {
            name: "no-reachable",
            severity: "warn",
          },
        ],
      },
    );
  });

  it("Triggers on modules that have a reachable attribute (with a pathNot, reachable false)", () => {
    const lReachableFalsePathNotRuleSet = parseRuleSet({
      forbidden: [
        {
          name: "no-unreachable",
          from: { path: "src/index\\.js" },
          to: { reachable: false, pathNot: "something" },
        },
      ],
    });

    deepEqual(
      validate.module(lReachableFalsePathNotRuleSet, {
        source: "something",
        reachable: [
          {
            asDefinedInRule: "no-unreachable",
            matchedFrom: "azazel",
            value: false,
          },
        ],
      }),
      { valid: true },
    );
  });

  it("Triggers on modules that have a reachable attribute (with a pathNot, reachable true)", () => {
    const lReachableTruePathNotRuleSet = parseRuleSet({
      forbidden: [
        {
          name: "no-reachable",
          from: { path: "src/index\\.js" },
          to: { reachable: true, pathNot: "something" },
        },
      ],
    });
    deepEqual(
      validate.module(lReachableTruePathNotRuleSet, {
        source: "something",
        reachable: [
          {
            asDefinedInRule: "no-reachable",
            matchedFrom: "azazel",
            value: true,
          },
        ],
      }),
      { valid: true },
    );
  });
});
describe("[I] validate/index - reachable (in allowed set)", () => {
  const lReachableAllowedRuleSet = parseRuleSet({
    allowed: [
      {
        from: { path: "^src/main/index\\.js" },
        to: { reachable: true },
      },
    ],
  });
  it("Triggers on modules that have no reachable attribute ('allowed' rule set)", () => {
    deepEqual(
      validate.module(lReachableAllowedRuleSet, {
        source: "something",
      }),
      {
        valid: false,
        rules: [
          {
            name: "not-in-allowed",
            severity: "warn",
          },
        ],
      },
    );
  });

  it("Skips on modules that have a reachable attribute (match - 'allowed' rule set)", () => {
    deepEqual(
      validate.module(lReachableAllowedRuleSet, {
        source: "something",
        reachable: [
          {
            value: true,
            matchedFrom: "azazel",
            asDefinedInRule: "not-in-allowed",
          },
        ],
      }),
      {
        valid: true,
      },
    );
  });

  it("Triggers on modules that have a reachable attribute (no match - 'allowed' rule set)", () => {
    deepEqual(
      validate.module(lReachableAllowedRuleSet, {
        source: "something",
        reachable: [
          {
            value: false,
            asDefinedInRule: "not-in-allowed",
          },
        ],
      }),
      {
        valid: false,
        rules: [
          {
            name: "not-in-allowed",
            severity: "warn",
          },
        ],
      },
    );
  });

  it("Respects capturing groups", () => {
    const lReachableCapturingGroupsRuleSet = parseRuleSet({
      forbidden: [
        {
          name: "capt-group",
          from: { path: "^src/([^/]+)/index\\.js$" },
          to: {
            path: "^src/$1/.+",
            reachable: false,
          },
        },
      ],
    });
    const lModule = {
      source: "src/hoonk/not-reached.js",
      reachable: [
        {
          value: false,
          asDefinedInRule: "capt-group",
          matchedFrom: "src/hoonk/index.js",
        },
      ],
    };
    const lValidationResult = validate.module(
      lReachableCapturingGroupsRuleSet,
      lModule,
    );
    deepEqual(lValidationResult, {
      valid: false,
      rules: [
        {
          name: "capt-group",
          severity: "warn",
        },
      ],
    });
  });
});
