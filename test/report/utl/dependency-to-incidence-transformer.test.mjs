import { deepStrictEqual } from "node:assert";
import { describe, it } from "node:test";
import transform from "../../../src/report/utl/dependency-to-incidence-transformer.mjs";

import oneViolation from "./__mocks__/one-violation.mjs";
import ONE_VIOLATION_DEPS_FIXTURE from "./__mocks__/one-violation-incidences.mjs";
import moreViolations from "./__mocks__/more-violations.mjs";
import MORE_VIOLATIONS_DEPS_FIXTURE from "./__mocks__/more-violations-incidences.mjs";

const ONE_VIOLATION_DEPS_INPUT = oneViolation.modules;
const MORE_VIOLATIONS_DEPS_INPUT = moreViolations.modules;

describe("[U] dependencyToIncidenceTransformer", () => {
  it("leaves an empty dependencies list alone", () => {
    deepStrictEqual(transform([]), []);
  });

  it("reports single rule violations at the incidence", () => {
    deepStrictEqual(
      transform(ONE_VIOLATION_DEPS_INPUT),
      ONE_VIOLATION_DEPS_FIXTURE
    );
  });

  it("reports multiple rule violations per dependency at the incidence with a hint there's more", () => {
    deepStrictEqual(
      transform(MORE_VIOLATIONS_DEPS_INPUT),
      MORE_VIOLATIONS_DEPS_FIXTURE
    );
  });
});
