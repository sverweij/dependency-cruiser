const expect = require("chai").expect;
const orphan = require("../../../../src/extract/derive/orphan");

const ONE_MODULE_FIXTURE = require("./fixtures/oneModule.json");
const ONE_MODULE_AFTER_PROCESSING = require("./fixtures/oneModule.afterprocessing.json");
const TWO_MODULES_FIXTURE = require("./fixtures/twoModule.json");
const TWO_MODULES_AFTER_PROCESSING = require("./fixtures/twoModule.afterprocessing.json");

describe("extract/derive/orphan/index - orphan detection", () => {
  it('does _not_ attach the "orphan" boolean to orphan modules by default', () => {
    expect(orphan(ONE_MODULE_FIXTURE, {})).to.deep.equal(ONE_MODULE_FIXTURE);
  });

  it('attaches the "orphan" boolean to orphan modules when forced to', () => {
    expect(
      orphan(ONE_MODULE_FIXTURE, { forceOrphanCheck: true })
    ).to.deep.equal(ONE_MODULE_AFTER_PROCESSING);
  });

  it('attaches the "orphan" boolean to orphan modules if the ruleset requires an orphan check', () => {
    expect(
      orphan(ONE_MODULE_FIXTURE, {
        validate: true,
        ruleSet: {
          forbidden: [
            {
              from: {
                orphan: true
              },
              to: {}
            }
          ]
        }
      })
    ).to.deep.equal(ONE_MODULE_AFTER_PROCESSING);
  });

  it('does attachs the "orphan" boolean to non-orphan modules with the value "false"', () => {
    expect(
      orphan(TWO_MODULES_FIXTURE, { forceOrphanCheck: true })
    ).to.deep.equal(TWO_MODULES_AFTER_PROCESSING);
  });
});
