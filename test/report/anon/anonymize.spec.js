const chai = require("chai");
const _clone = require("lodash/clone");
const sourceReport = require("./mocks/src-report.json");
const fixtureReport = require("./fixtures/src-report.json");
const sourceReportWithWordlist = require("./mocks/src-report-wordlist.json");
const fixtureReportWithWordlist = require("./fixtures/src-report-wordlist.json");
const reachesReport = require("./mocks/reaches-report.json");
const fixtureReachesReport = require("./fixtures/reaches-report.json");
const sourceCycle = require("./mocks/cycle.json");
const fixtureCycle = require("./fixtures/cycle.json");
const cruiseResultSchema = require("~/src/schema/cruise-result.schema.json");
const anonymizePathElement = require("~/src/report/anon/anonymize-path-element");
const anonymize = require("~/src/report/anon");

chai.use(require("chai-json-schema"));

const expect = chai.expect;

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
    anonymizePathElement.clearCache();
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
