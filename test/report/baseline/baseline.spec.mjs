import { expect, use } from "chai";
import chaiJSONSchema from "chai-json-schema";
import baseline from "../../../src/report/baseline.mjs";
import { createRequireJSON } from "../../backwards.utl.mjs";
import baselineSchema from "../../../src/schema/baseline-violations.schema.mjs";

const requireJSON = createRequireJSON(import.meta.url);
use(chaiJSONSchema);

describe("[I] report/baseline", () => {
  it("returns an empty array when there's no violations", () => {
    const lInput = requireJSON("./__mocks__/dc-result-no-violations.json");
    const lExpected = [];
    const lResult = baseline(lInput);

    expect(JSON.parse(lResult.output)).to.deep.equal(lExpected);
    expect(lResult.exitCode).to.equal(0);
    expect(JSON.parse(lResult.output)).to.be.jsonSchema(baselineSchema);
  });

  it("returns the violations in a json object", () => {
    const lInput = requireJSON("./__mocks__/dc-result-with-violations.json");
    const lExpected = requireJSON("./__fixtures__/baseline-result.json");
    const lResult = baseline(lInput);

    expect(JSON.parse(lResult.output)).to.deep.equal(lExpected);
    expect(lResult.exitCode).to.equal(0);
    expect(JSON.parse(lResult.output)).to.be.jsonSchema(baselineSchema);
  });
});
