import { deepEqual, equal } from "node:assert/strict";
import Ajv from "ajv";
import { createRequireJSON } from "../../backwards.utl.mjs";
import baselineSchema from "#schema/baseline-violations.schema.mjs";
import baseline from "#report/baseline.mjs";

const requireJSON = createRequireJSON(import.meta.url);
const ajv = new Ajv();

describe("[I] report/baseline", () => {
  it("returns an empty array when there's no violations", () => {
    const lInput = requireJSON("./__mocks__/dc-result-no-violations.json");
    const lExpected = [];
    const lResult = baseline(lInput);

    deepEqual(JSON.parse(lResult.output), lExpected);
    equal(lResult.exitCode, 0);
    ajv.validate(baselineSchema, JSON.parse(lResult.output));
  });

  it("returns the violations in a json object", () => {
    const lInput = requireJSON("./__mocks__/dc-result-with-violations.json");
    const lExpected = requireJSON("./__fixtures__/baseline-result.json");
    const lResult = baseline(lInput);

    deepEqual(JSON.parse(lResult.output), lExpected);
    equal(lResult.exitCode, 0);
    ajv.validate(baselineSchema, JSON.parse(lResult.output));
  });

  it("adds new violations to the baseline in full mode", () => {
    const lInput = requireJSON("./__mocks__/dc-result-with-violations.json");
    const lKnownViolations = lInput.summary.violations.slice(0, -1);
    lInput.summary.optionsUsed.knownViolations = lKnownViolations;

    const lResult = baseline(lInput, { mode: "full" });

    deepEqual(JSON.parse(lResult.output), lInput.summary.violations);
    equal(
      lResult.meta,
      "\nbaseline  : 6 violations\n\n" +
        "  new     : 1 (running in 'full' mode => added to the baseline)\n" +
        "  same    : 5\n" +
        "  removed : 0\n",
    );
  });

  it("prunes new violations from the baseline in prune mode", () => {
    const lInput = requireJSON("./__mocks__/dc-result-with-violations.json");
    const lKnownViolations = lInput.summary.violations.slice(0, -1);
    lInput.summary.optionsUsed.knownViolations = lKnownViolations;

    const lResult = baseline(lInput, { mode: "prune" });

    deepEqual(JSON.parse(lResult.output), lKnownViolations);
    equal(
      lResult.meta,
      "\nbaseline  : 5 violations\n\n" +
        "  new     : 1 (running in 'prune' mode => not added to the baseline)\n" +
        "  same    : 5\n" +
        "  removed : 0\n",
    );
  });

  it("does not add mode details when there are no new violations", () => {
    const lInput = requireJSON("./__mocks__/dc-result-with-violations.json");
    lInput.summary.optionsUsed.knownViolations = lInput.summary.violations;

    const lResult = baseline(lInput);

    equal(
      lResult.meta,
      "\nbaseline  : 6 violations\n\n" +
        "  new     : 0\n" +
        "  same    : 6\n" +
        "  removed : 0\n",
    );
  });
});
