const chai = require("chai");
const main = require("../../src/main");

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
    optionsUsed: {}
  }
};

describe("main.format - format", () => {
  it("barfs when it gets an invalid output type", () => {
    try {
      main.format({}, "not-a-valid-reporter");
      expect("not to be here").to.equal("still here, though");
    } catch (e) {
      expect(e.toString()).to.contain(
        "Error: 'not-a-valid-reporter' is not a valid output type."
      );
    }
  });

  it("barfs when it gets a result passed that is invalid json", () => {
    try {
      main.format("that is no json");
      expect("not to be here").to.equal("still here, though");
    } catch (e) {
      expect(e.toString()).to.contain(
        "Error: The supplied dependency-cruiser result is not valid:"
      );
    }
  });

  it("barfs when it gets a result passed that doesn't comply to the result schema", () => {
    try {
      main.format({ valid: "JSON", not: "schema compliant though" });
      expect("not to be here").to.equal("still here, though");
    } catch (e) {
      expect(e.toString()).to.contain(
        "Error: The supplied dependency-cruiser result is not valid: data should NOT have additional properties"
      );
    }
  });

  it("returns an err reporter formatted report when presented with a legal result", () => {
    expect(main.format(MINIMAL_RESULT, "err").output).to.contain(
      "no dependency violations found (0 modules, 0 dependencies cruised)"
    );
  });

  it("returns an json reporter formatted report when presented with a legal result", () => {
    expect(
      JSON.parse(main.format(MINIMAL_RESULT, "json").output)
    ).to.deep.equal(MINIMAL_RESULT);
  });
});
