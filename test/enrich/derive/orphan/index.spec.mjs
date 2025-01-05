import { deepEqual, equal } from "node:assert/strict";

import ONE_MODULE_FIXTURE from "./__mocks__/one-module.mjs";
import ONE_MODULE_AFTER_PROCESSING from "./__mocks__/one-module.afterprocessing.mjs";
import TWO_MODULES_FIXTURE from "./__mocks__/two-module.mjs";
import TWO_MODULES_AFTER_PROCESSING from "./__mocks__/two-module.afterprocessing.mjs";
import deriveOrphans, { hasOrphanRule } from "#enrich/derive/orphan/index.mjs";

const RULE_SET_WITH_ORPHAN_RULE = {
  forbidden: [
    {
      from: {
        orphan: true,
      },
      to: {},
    },
  ],
};

const RULE_SET_WITH_ALLOWED_ORPHAN_RULE = {
  allowed: [
    {
      from: { orphan: false },
      to: {},
    },
  ],
};

describe("[U] enrich/derive/orphan/index - hasOrphanRule", () => {
  it("returns false on an empty rule set", () => {
    equal(hasOrphanRule([]), false);
  });

  it("returns false on a rule set with an orhpan rule (forbidden)", () => {
    equal(hasOrphanRule(RULE_SET_WITH_ORPHAN_RULE), true);
  });

  it("returns false on a rule set with an orhpan rule (alllowed)", () => {
    equal(hasOrphanRule(RULE_SET_WITH_ALLOWED_ORPHAN_RULE), true);
  });
});

describe("[U] enrich/derive/orphan/index - orphan detection", () => {
  it('attaches the "orphan" boolean to orphan modules by default', () => {
    deepEqual(
      deriveOrphans(ONE_MODULE_FIXTURE, {}),
      ONE_MODULE_AFTER_PROCESSING,
    );
  });

  it('attaches the "orphan" boolean to orphan modules if the ruleset requires an orphan check, and skipAnalysisNotInRules is absent', () => {
    deepEqual(
      deriveOrphans(ONE_MODULE_FIXTURE, {
        validate: true,
        ruleSet: RULE_SET_WITH_ORPHAN_RULE,
      }),
      ONE_MODULE_AFTER_PROCESSING,
    );
  });

  it('attaches the "orphan" boolean to orphan modules if the ruleset requires an orphan check, and skipAnalysisNotInRules is true', () => {
    deepEqual(
      deriveOrphans(ONE_MODULE_FIXTURE, {
        skipAnalysisNotInRules: true,
        validate: true,
        ruleSet: {
          forbidden: [
            {
              from: {
                orphan: true,
              },
              to: {},
            },
          ],
        },
      }),
      ONE_MODULE_AFTER_PROCESSING,
    );
  });

  it('does attach the "orphan" boolean to non-orphan modules with the value "false"', () => {
    deepEqual(
      deriveOrphans(TWO_MODULES_FIXTURE, {}),
      TWO_MODULES_AFTER_PROCESSING,
    );
  });

  it("does not attach any orphan attribute when the rule set doesn't have an orphan rule and skipAnalysisNotInRules=true", () => {
    deepEqual(
      deriveOrphans(ONE_MODULE_FIXTURE, {
        skipAnalysisNotInRules: true,
        ruleSet: {},
      }),
      ONE_MODULE_FIXTURE,
    );
  });
});
