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
});
