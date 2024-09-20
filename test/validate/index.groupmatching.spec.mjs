import { deepEqual } from "node:assert/strict";
import parseRuleSet from "./parse-ruleset.utl.mjs";
import { validateDependency } from "#validate/index.mjs";

describe("[I] validate/index group matching - path group matched in a pathnot", () => {
  const lGroupToPathNotRuleSet = {
    forbidden: [
      {
        name: "group-to-pathnot",
        comment:
          "not to peer folders directly under source (except self and 'shared')",
        from: {
          path: "^src/([^/]+)/.+",
        },
        to: {
          path: "^src/[^/]+/.+",
          pathNot: "^src/($1|shared)/.+",
        },
      },
    ],
  };

  it("group-to-pathnot - Disallows dependencies between peer folders", () => {
    deepEqual(
      validateDependency(
        parseRuleSet(lGroupToPathNotRuleSet),
        { source: "src/aap/chimpansee.ts" },
        { resolved: "src/noot/pinda.ts" },
      ),
      {
        valid: false,
        rules: [
          {
            name: "group-to-pathnot",
            severity: "warn",
          },
        ],
      },
    );
  });

  it("group-to-pathnot - Allows dependencies within to peer folder 'shared'", () => {
    deepEqual(
      validateDependency(
        parseRuleSet(lGroupToPathNotRuleSet),
        { source: "src/aap/chimpansee.ts" },
        { resolved: "src/shared/bananas.ts" },
      ),
      { valid: true },
    );
  });

  it("group-to-pathnot - Allows dependencies within own folder", () => {
    deepEqual(
      validateDependency(
        parseRuleSet(lGroupToPathNotRuleSet),
        { source: "src/aap/chimpansee.ts" },
        { resolved: "src/aap/oerangoetang.ts" },
      ),
      { valid: true },
    );
  });

  it("group-to-pathnot - Allows dependencies to sub folders of own folder", () => {
    deepEqual(
      validateDependency(
        parseRuleSet(lGroupToPathNotRuleSet),
        { source: "src/aap/chimpansee.ts" },
        { resolved: "src/aap/speeltuigen/autoband.ts" },
      ),
      { valid: true },
    );
  });

  it("group-to-pathnot - Allows peer dependencies between sub folders of own folder", () => {
    deepEqual(
      validateDependency(
        parseRuleSet(lGroupToPathNotRuleSet),
        { source: "src/aap/rekwisieten/touw.ts" },
        { resolved: "src/aap/speeltuigen/autoband.ts" },
      ),
      { valid: true },
    );
  });
});

describe("[I] validate/index group matching - second path group matched in a pathnot", () => {
  const lGroupTwoToPathNotRuleSet = {
    forbidden: [
      {
        name: "group-two-to-pathnot",
        comment:
          "not to peer folders directly under source (except self and 'shared')",
        from: {
          path: "^(src)/([^/]+)/.+",
        },
        to: {
          path: "^src/[^/]+/.+",
          pathNot: "^src/($2|shared)/.+",
        },
      },
    ],
  };

  it("group-two-to-pathnot - Disallows dependencies between peer folders", () => {
    deepEqual(
      validateDependency(
        parseRuleSet(lGroupTwoToPathNotRuleSet),
        { source: "src/aap/chimpansee.ts" },
        { resolved: "src/noot/pinda.ts" },
      ),
      {
        valid: false,
        rules: [
          {
            name: "group-two-to-pathnot",
            severity: "warn",
          },
        ],
      },
    );
  });

  it("group-two-to-pathnot - Allows dependencies within to peer folder 'shared'", () => {
    deepEqual(
      validateDependency(
        parseRuleSet(lGroupTwoToPathNotRuleSet),
        { source: "src/aap/chimpansee.ts" },
        { resolved: "src/shared/bananas.ts" },
      ),
      { valid: true },
    );
  });

  it("group-two-to-pathnot - Allows dependencies within own folder", () => {
    deepEqual(
      validateDependency(
        parseRuleSet(lGroupTwoToPathNotRuleSet),
        { source: "src/aap/chimpansee.ts" },
        { resolved: "src/aap/oerangoetang.ts" },
      ),
      { valid: true },
    );
  });

  it("group-two-to-pathnot - Allows dependencies to sub folders of own folder", () => {
    deepEqual(
      validateDependency(
        parseRuleSet(lGroupTwoToPathNotRuleSet),
        { source: "src/aap/chimpansee.ts" },
        { resolved: "src/aap/speeltuigen/autoband.ts" },
      ),
      { valid: true },
    );
  });

  it("group-two-to-pathnot - Allows peer dependencies between sub folders of own folder", () => {
    deepEqual(
      validateDependency(
        parseRuleSet(lGroupTwoToPathNotRuleSet),
        { source: "src/aap/rekwisieten/touw.ts" },
        { resolved: "src/aap/speeltuigen/autoband.ts" },
      ),
      { valid: true },
    );
  });
});
