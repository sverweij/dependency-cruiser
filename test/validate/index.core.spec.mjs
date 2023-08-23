import { deepEqual } from "node:assert/strict";
import validate from "../../src/validate/index.mjs";
import parseRuleSet from "./parse-ruleset.utl.mjs";

describe("[I] validate/index - core", () => {
  const lNotToCoreRuleSet = parseRuleSet({
    forbidden: [
      {
        name: "not-to-core",
        severity: "error",
        from: {},
        to: {
          dependencyTypes: ["core"],
        },
      },
    ],
  });

  const lNotToCoreSpecificsRuleSet = parseRuleSet({
    forbidden: [
      {
        name: "not-to-core-fs-os",
        severity: "error",
        from: {},
        to: {
          dependencyTypes: ["core"],
          path: "(fs|os)",
        },
      },
    ],
  });

  const lOnlyToCoreViaForbiddenRuleSet = parseRuleSet({
    forbidden: [
      {
        name: "only-to-core",
        severity: "error",
        from: {},
        to: {
          dependencyTypes: [
            "local",
            "npm",
            "npm-dev",
            "npm-optional",
            "npm-peer",
            "npm-no-pkg",
            "npm-unknown",
            "unknown",
            "undetermined",
          ],
        },
      },
    ],
  });

  it("not to core - ok", () => {
    deepEqual(
      validate.dependency(
        lNotToCoreRuleSet,
        { source: "koos koets" },
        { resolved: "path", dependencyTypes: ["npm"] },
      ),
      { valid: true },
    );
  });

  it("not to core - violation", () => {
    deepEqual(
      validate.dependency(
        lNotToCoreRuleSet,
        { source: "koos koets" },
        { resolved: "path", dependencyTypes: ["core"] },
      ),
      {
        valid: false,
        rules: [{ severity: "error", name: "not-to-core" }],
      },
    );
  });

  it("not to core fs os - ok", () => {
    deepEqual(
      validate.dependency(
        lNotToCoreSpecificsRuleSet,
        { source: "koos koets" },
        { resolved: "path", dependencyTypes: ["core"] },
      ),
      { valid: true },
    );
  });

  it("not to core fs os - violation", () => {
    deepEqual(
      validate.dependency(
        lNotToCoreSpecificsRuleSet,
        { source: "koos koets" },
        { resolved: "os", dependencyTypes: ["core"] },
      ),
      {
        valid: false,
        rules: [{ severity: "error", name: "not-to-core-fs-os" }],
      },
    );
  });

  it("only to core - via 'allowed' - ok", () => {
    const lRuleSet = parseRuleSet({
      allowed: [
        {
          from: {},
          to: {
            dependencyTypes: ["core"],
          },
        },
      ],
    });

    deepEqual(
      validate.dependency(
        lRuleSet,
        { source: "koos koets" },
        { resolved: "os", dependencyTypes: ["core"] },
      ),
      { valid: true },
    );
  });

  it("only to core - with dependencyTypesNot in forbidden - ok", () => {
    const lRuleSet = parseRuleSet({
      forbidden: [
        {
          name: "only-to-core",
          severity: "error",
          from: {},
          to: {
            dependencyTypesNot: ["core"],
          },
        },
      ],
    });

    deepEqual(
      validate.dependency(
        lRuleSet,

        { source: "koos koets" },
        { resolved: "os", dependencyTypes: ["core"] },
      ),
      { valid: true },
    );
  });

  it("only to core - with dependencyTypesNot in forbidden - nok", () => {
    const lRuleSet = parseRuleSet({
      forbidden: [
        {
          name: "only-to-core",
          severity: "error",
          from: {},
          to: {
            dependencyTypesNot: ["core"],
          },
        },
      ],
    });

    deepEqual(
      validate.dependency(
        lRuleSet,
        { source: "koos koets" },
        { resolved: "robbie kerkhof", dependencyTypes: ["local"] },
      ),
      {
        valid: false,
        rules: [
          {
            name: "only-to-core",
            severity: "error",
          },
        ],
      },
    );
  });

  it("only to core - via 'allowed' - violation", () => {
    const lRuleSet = parseRuleSet({
      allowed: [
        {
          from: {},
          to: {
            dependencyTypes: ["core"],
          },
        },
      ],
    });

    deepEqual(
      validate.dependency(
        lRuleSet,
        { source: "koos koets" },
        { resolved: "ger hekking", dependencyTypes: ["npm"] },
      ),
      {
        valid: false,
        rules: [{ severity: "warn", name: "not-in-allowed" }],
      },
    );
  });

  it("only to core - via 'forbidden' - ok", () => {
    deepEqual(
      validate.dependency(
        lOnlyToCoreViaForbiddenRuleSet,
        { source: "koos koets" },
        { resolved: "os", dependencyTypes: ["core"] },
      ),
      { valid: true },
    );
  });

  it("only to core - via 'forbidden' - violation", () => {
    deepEqual(
      validate.dependency(
        lOnlyToCoreViaForbiddenRuleSet,
        { source: "koos koets" },
        { resolved: "ger hekking", dependencyTypes: ["local"] },
      ),
      {
        valid: false,
        rules: [{ severity: "error", name: "only-to-core" }],
      },
    );
  });
});
