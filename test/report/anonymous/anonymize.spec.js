const expect = require("chai").expect;
const _clone = require("lodash/clone");
const anonymize = require("../../../src/report/anonymous");
const anonymizePathElement = require("../../../src/report/anonymous/anonymizePathElement");
const srcReport = require("./mocks/src-report.json");
const fixtureReport = require("./fixtures/src-report.json");
const srcCycle = require("./mocks/cycle.json");
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

  it("anonymizes a result tree", () => {
    const lResult = anonymize(srcReport, _clone(META_SYNTACTIC_VARIABLES));

    expect(JSON.parse(lResult.output)).to.deep.equal(fixtureReport);
    expect(lResult.exitCode).to.equal(0);
  });

  it("anonymizes a result tree with (violated) rules", () => {
    const lResult = anonymize(srcCycle, _clone(META_SYNTACTIC_VARIABLES));
    // console.log(lResult.output);

    expect(JSON.parse(lResult.output)).to.deep.equal(fixtureCycle);
    expect(lResult.exitCode).to.equal(0);
  });
});
