import { expect, use } from "chai";
import _clone from "lodash/clone.js";
import chaiJSONSchema from "chai-json-schema";
import cruiseResultSchema from "../../../src/schema/cruise-result.schema.js";
import { clearCache } from "../../../src/report/anon/anonymize-path-element.js";
import anonymize from "../../../src/report/anon/index.js";
import sourceReport from "./mocks/src-report.mjs";
import fixtureReport from "./fixtures/src-report.mjs";
import sourceReportWithWordlist from "./mocks/src-report-wordlist.mjs";
import fixtureReportWithWordlist from "./fixtures/src-report-wordlist.mjs";
import reachesReport from "./mocks/reaches-report.mjs";
import fixtureReachesReport from "./fixtures/reaches-report.mjs";
import sourceCycle from "./mocks/cycle.mjs";
import fixtureCycle from "./fixtures/cycle.mjs";

use(chaiJSONSchema);

const META_SYNTACTIC_VARIABLES = [
  "foo",
  "bar",
  "baz",
  "qux",
  "quux",
  "quuz",
  "corge",
  "grault",
  "garply",
  "waldo",
  "fred",
  "plugh",
  "xyzzy",
  "thud",
  "wibble",
  "wobble",
  "wubble",
  "flob",
];

describe("report/anon", () => {
  beforeEach(() => {
    clearCache();
  });

  it("anonymizes a result tree with the passed word list", () => {
    const lResult = anonymize(sourceReport, {
      wordlist: _clone(META_SYNTACTIC_VARIABLES),
    });
    const lOutput = JSON.parse(lResult.output);

    expect(lOutput).to.deep.equal(fixtureReport);
    expect(lOutput).to.be.jsonSchema(cruiseResultSchema);
    expect(lResult.exitCode).to.equal(0);
  });

  it("anonymizes a result tree with the word list passed in the result tree", () => {
    const lResult = anonymize(sourceReportWithWordlist);
    const lOutput = JSON.parse(lResult.output);

    expect(lOutput).to.deep.equal(fixtureReportWithWordlist);
    expect(lOutput).to.be.jsonSchema(cruiseResultSchema);
    expect(lResult.exitCode).to.equal(0);
  });

  it("anonymizes a result tree with (violated) rules", () => {
    const lResult = anonymize(sourceCycle, {
      wordlist: _clone(META_SYNTACTIC_VARIABLES),
    });
    const lOutput = JSON.parse(lResult.output);

    expect(lOutput).to.deep.equal(fixtureCycle);
    expect(lOutput).to.be.jsonSchema(cruiseResultSchema);
    expect(lResult.exitCode).to.equal(0);
  });
  it("anonymizes a result tree with (violated) reaches rules", () => {
    const lResult = anonymize(reachesReport, {
      wordlist: _clone(META_SYNTACTIC_VARIABLES),
    });
    const lOutput = JSON.parse(lResult.output);

    expect(lOutput).to.deep.equal(fixtureReachesReport);
    expect(lOutput).to.be.jsonSchema(cruiseResultSchema);
    expect(lResult.exitCode).to.equal(0);
  });
});
