const expect = require("chai").expect;
const _clone = require("lodash/clone");
const anonymize = require("../../../src/report/anon");
const anonymizePathElement = require("../../../src/report/anon/anonymize-path-element");
const sourceReport = require("./mocks/src-report.json");
const fixtureReport = require("./fixtures/src-report.json");
const sourceReportWithWordlist = require("./mocks/src-report-wordlist.json");
const fixtureReportWithWordlist = require("./fixtures/src-report-wordlist.json");
const reachesReport = require("./mocks/reaches-report.json");
const fixtureReachesReport = require("./fixtures/reaches-report.json");
const sourceCycle = require("./mocks/cycle.json");
const fixtureCycle = require("./fixtures/cycle.json");

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
  "flob"
];

describe("report/anonymous", () => {
  beforeEach(() => {
    anonymizePathElement.clearCache();
  });

  it("anonymizes a result tree with the passed word list", () => {
    const lResult = anonymize(sourceReport, _clone(META_SYNTACTIC_VARIABLES));

    expect(JSON.parse(lResult.output)).to.deep.equal(fixtureReport);
    expect(lResult.exitCode).to.equal(0);
  });

  it("anonymizes a result tree with the word list passed in the result tree", () => {
    const lResult = anonymize(sourceReportWithWordlist);

    expect(JSON.parse(lResult.output)).to.deep.equal(fixtureReportWithWordlist);
    expect(lResult.exitCode).to.equal(0);
  });

  it("anonymizes a result tree with (violated) rules", () => {
    const lResult = anonymize(sourceCycle, _clone(META_SYNTACTIC_VARIABLES));

    expect(JSON.parse(lResult.output)).to.deep.equal(fixtureCycle);
    expect(lResult.exitCode).to.equal(0);
  });
  it("anonymizes a result tree with (violated) reaches rules", () => {
    const lResult = anonymize(reachesReport, _clone(META_SYNTACTIC_VARIABLES));

    expect(JSON.parse(lResult.output)).to.deep.equal(fixtureReachesReport);
    expect(lResult.exitCode).to.equal(0);
  });
});
