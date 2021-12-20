import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { expect } from "chai";
import render from "../../../src/report/teamcity.js";
import okdeps from "./mocks/everything-fine.mjs";
import moduleErrs from "./mocks/module-errors.mjs";
import requiredErrs from "./mocks/required-errors.mjs";
import circulars from "./mocks/circular-deps.mjs";
import vias from "./mocks/via-deps.mjs";
import unsupportedErrorLevels from "./mocks/unsupported-severity.mjs";
import knownViolations from "./mocks/known-violations.mjs";
import instabilities from "./mocks/instabilities.mjs";

function removePerSessionAttributes(pString) {
  return pString.replace(/ flowId='[^']+' timestamp='[^']+'/g, "");
}

function readFixture(pRelativePath) {
  return readFileSync(
    fileURLToPath(new URL(pRelativePath, import.meta.url)),
    "utf8"
  );
}
describe("report/teamcity", () => {
  it("says everything fine when everything is fine", () => {
    const lFixture = readFixture("mocks/everything-fine-teamcity-format.txt");
    const lResult = render(okdeps);

    expect(removePerSessionAttributes(lResult.output)).to.equal(lFixture);
    expect(lResult.exitCode).to.equal(0);
  });

  it("renders module only transgressions", () => {
    const lFixture = readFixture("mocks/module-errors-teamcity-format.txt");
    const lResult = render(moduleErrs);

    expect(removePerSessionAttributes(lResult.output)).to.equal(
      removePerSessionAttributes(lFixture)
    );
    // eslint-disable-next-line no-magic-numbers
    expect(lResult.exitCode).to.equal(5);
  });

  it("renders 'required' violations", () => {
    const lFixture = readFixture("mocks/required-errors-teamcity-format.txt");
    const lResult = render(requiredErrs);

    expect(removePerSessionAttributes(lResult.output)).to.equal(
      removePerSessionAttributes(lFixture)
    );
    // eslint-disable-next-line no-magic-numbers
    expect(lResult.exitCode).to.equal(5);
  });

  it("renders circular transgressions", () => {
    const lFixture = readFixture("mocks/circular-deps-teamcity-format.txt");
    const lResult = render(circulars);

    expect(removePerSessionAttributes(lResult.output)).to.equal(
      removePerSessionAttributes(lFixture)
    );
    // eslint-disable-next-line no-magic-numbers
    expect(lResult.exitCode).to.equal(3);
  });

  it("renders via transgressions", () => {
    const lFixture = readFixture("mocks/via-deps-teamcity-format.txt");
    const lResult = render(vias);

    expect(removePerSessionAttributes(lResult.output)).to.equal(
      removePerSessionAttributes(lFixture)
    );
    // eslint-disable-next-line no-magic-numbers
    expect(lResult.exitCode).to.equal(4);
  });

  it("renders instability transgressions", () => {
    const lFixture = readFixture("mocks/instabilities-teamcity-format.txt");
    const lResult = render(instabilities);

    expect(removePerSessionAttributes(lResult.output)).to.equal(
      removePerSessionAttributes(lFixture)
    );
    // eslint-disable-next-line no-magic-numbers
    expect(lResult.exitCode).to.equal(0);
  });

  it("renders unsupported error levels (like 'ignore') as 'info'", () => {
    const lFixture = readFixture(
      "mocks/unsupported-severity-teamcity-format.txt"
    );
    const lResult = render(unsupportedErrorLevels);

    expect(removePerSessionAttributes(lResult.output)).to.equal(
      removePerSessionAttributes(lFixture)
    );
    // eslint-disable-next-line no-magic-numbers
    expect(lResult.exitCode).to.equal(5);
  });

  it("renders known errors in a single warning", () => {
    const lFixture = readFixture("mocks/known-violations-teamcity-format.txt");
    const lResult = render(knownViolations);

    expect(removePerSessionAttributes(lResult.output)).to.equal(
      removePerSessionAttributes(lFixture)
    );
    expect(lResult.exitCode).to.equal(0);
  });
});
