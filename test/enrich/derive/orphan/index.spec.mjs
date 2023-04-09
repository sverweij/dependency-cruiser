import { expect } from "chai";

import orphan from "../../../../src/enrich/derive/orphan/index.mjs";
import ONE_MODULE_FIXTURE from "./__mocks__/one-module.mjs";
import ONE_MODULE_AFTER_PROCESSING from "./__mocks__/one-module.afterprocessing.mjs";
import TWO_MODULES_FIXTURE from "./__mocks__/two-module.mjs";
import TWO_MODULES_AFTER_PROCESSING from "./__mocks__/two-module.afterprocessing.mjs";

describe("[U] enrich/derive/orphan/index - orphan detection", () => {
  it('attaches the "orphan" boolean to orphan modules by default', () => {
    expect(orphan(ONE_MODULE_FIXTURE, {})).to.deep.equal(
      ONE_MODULE_AFTER_PROCESSING
    );
  });

  it('attaches the "orphan" boolean to orphan modules if the ruleset requires an orphan check', () => {
    expect(
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
      })
    ).to.deep.equal(ONE_MODULE_AFTER_PROCESSING);
  });

  it('does attachs the "orphan" boolean to non-orphan modules with the value "false"', () => {
    expect(orphan(TWO_MODULES_FIXTURE)).to.deep.equal(
      TWO_MODULES_AFTER_PROCESSING
    );
  });
});
