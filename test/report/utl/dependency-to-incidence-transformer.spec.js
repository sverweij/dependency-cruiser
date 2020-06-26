const expect = require("chai").expect;

const ONE_VIOLATION_DEPS_INPUT = require("./mocks/one-violation.json").modules;
const ONE_VIOLATION_DEPS_FIXTURE = require("./mocks/one-violation-incidences.json");
const MORE_VIOLATIONS_DEPS_INPUT = require("./mocks/more-violations.json")
  .modules;
const MORE_VIOLATIONS_DEPS_FIXTURE = require("./mocks/more-violations-incidences.json");

const transform = require("~/src/report/utl/dependency-to-incidence-transformer");

describe("dependencyToIncidenceTransformer", () => {
  it("leaves an empty dependencies list alone", () => {
    expect(transform([])).to.deep.equal([]);
  });

  it("reports single rule violations at the incidence", () => {
    expect(transform(ONE_VIOLATION_DEPS_INPUT)).to.deep.equal(
      ONE_VIOLATION_DEPS_FIXTURE
    );
  });

  it("reports multiple rule violations per dependency at the incidence with a hint there's more", () => {
    expect(transform(MORE_VIOLATIONS_DEPS_INPUT)).to.deep.equal(
      MORE_VIOLATIONS_DEPS_FIXTURE
    );
  });
});
