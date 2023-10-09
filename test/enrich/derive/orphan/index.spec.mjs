import { deepEqual } from "node:assert/strict";

import ONE_MODULE_FIXTURE from "./__mocks__/one-module.mjs";
import ONE_MODULE_AFTER_PROCESSING from "./__mocks__/one-module.afterprocessing.mjs";
import TWO_MODULES_FIXTURE from "./__mocks__/two-module.mjs";
import TWO_MODULES_AFTER_PROCESSING from "./__mocks__/two-module.afterprocessing.mjs";
import orphan from "#enrich/derive/orphan/index.mjs";

describe("[U] enrich/derive/orphan/index - orphan detection", () => {
  it('attaches the "orphan" boolean to orphan modules by default', () => {
    deepEqual(orphan(ONE_MODULE_FIXTURE, {}), ONE_MODULE_AFTER_PROCESSING);
  });

  it('attaches the "orphan" boolean to orphan modules if the ruleset requires an orphan check', () => {
    deepEqual(
      orphan(ONE_MODULE_FIXTURE, {
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

  it('does attachs the "orphan" boolean to non-orphan modules with the value "false"', () => {
    deepEqual(orphan(TWO_MODULES_FIXTURE), TWO_MODULES_AFTER_PROCESSING);
  });
});
