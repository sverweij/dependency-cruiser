import { expect } from "chai";
import transform from "../../../src/report/utl/dependency-to-incidence-transformer.js";

import oneViolation from "./mocks/one-violation.mjs";
import ONE_VIOLATION_DEPS_FIXTURE from "./mocks/one-violation-incidences.mjs";
import moreViolations from "./mocks/more-violations.mjs";
import MORE_VIOLATIONS_DEPS_FIXTURE from "./mocks/more-violations-incidences.mjs";

const ONE_VIOLATION_DEPS_INPUT = oneViolation.modules;
const MORE_VIOLATIONS_DEPS_INPUT = moreViolations.modules;

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
