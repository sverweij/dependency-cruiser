/* eslint-disable no-magic-numbers */
const chai = require("chai");
const cruiseResult = require("./fixtures/cruise-results-dc-2020-08-30-src-cli.json");
const main = require("~/src/main");

const expect = chai.expect;

const MINIMAL_RESULT = {
  modules: [],
  summary: {
    violations: [],
    error: 0,
    warn: 0,
    info: 0,
    totalCruised: 0,
    totalDependenciesCruised: 0,
    optionsUsed: {},
  },
};

describe("main.format - format", () => {
  it("barfs when it gets an invalid output type", () => {
    expect(() => {
      main.format({}, { outputType: "not-a-valid-reporter" });
    }).to.throw("'not-a-valid-reporter' is not a valid output type.");
  });

  it("barfs when it gets a result passed that is invalid json", () => {
    expect(() => {
      main.format("that is no json");
    }).to.throw("The supplied dependency-cruiser result is not valid:");
  });

  it("barfs when it gets a result passed that doesn't comply to the result schema", () => {
    expect(() => {
      main.format({ valid: "JSON", not: "schema compliant though" });
    }).to.throw(
      "The supplied dependency-cruiser result is not valid: data should NOT have additional properties"
    );
  });

  it("returns an error reporter formatted report when presented with a legal result", () => {
    expect(
      main.format(MINIMAL_RESULT, { outputType: "err" }).output
    ).to.contain(
      "no dependency violations found (0 modules, 0 dependencies cruised)"
    );
  });

  it("returns an json reporter formatted report when presented with a legal result", () => {
    expect(
      JSON.parse(main.format(MINIMAL_RESULT, { outputType: "json" }).output)
    ).to.deep.equal(MINIMAL_RESULT);
  });

  it("returns a collapsed version of the report when passed a collapse option", () => {
    const lCollapsedResult = main.format(cruiseResult, {
      collapse: "^[^/]+/[^/]+/",
    }).output;

    expect(lCollapsedResult.summary.violations).to.deep.equal([
      {
        from: "src/cli/",
        to: "src/extract/",
        rule: {
          severity: "warn",
          name: "cli-to-main-only-warn",
        },
      },
    ]);
    expect(lCollapsedResult.summary.totalCruised).to.equal(19);
    expect(lCollapsedResult.summary.totalDependenciesCruised).to.equal(18);
  });
});
