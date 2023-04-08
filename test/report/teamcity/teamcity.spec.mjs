import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { expect } from "chai";
import render from "../../../src/report/teamcity.mjs";
import okdeps from "./__mocks__/everything-fine.mjs";
import moduleErrs from "./__mocks__/module-errors.mjs";
import requiredErrs from "./__mocks__/required-errors.mjs";
import circulars from "./__mocks__/circular-deps.mjs";
import vias from "./__mocks__/via-deps.mjs";
import unsupportedErrorLevels from "./__mocks__/unsupported-severity.mjs";
import knownViolations from "./__mocks__/known-violations.mjs";
import instabilities from "./__mocks__/instabilities.mjs";

function removePerSessionAttributes(pString) {
  return pString.replace(/ flowId='[^']+' timestamp='[^']+'/g, "");
}

function readFixture(pRelativePath) {
  return readFileSync(
    fileURLToPath(new URL(pRelativePath, import.meta.url)),
    "utf8"
  );
}
describe("[I] report/teamcity", () => {
  it("says everything fine when everything is fine", () => {
    const lFixture = readFixture(
      "__mocks__/everything-fine-teamcity-format.txt"
    );
    const lResult = render(okdeps);

    expect(removePerSessionAttributes(lResult.output)).to.equal(lFixture);
    expect(lResult.exitCode).to.equal(0);
  });

  it("renders module only transgressions", () => {
    const lFixture = readFixture("__mocks__/module-errors-teamcity-format.txt");
    const lResult = render(moduleErrs);

    expect(removePerSessionAttributes(lResult.output)).to.equal(
      removePerSessionAttributes(lFixture)
    );
    // eslint-disable-next-line no-magic-numbers
    expect(lResult.exitCode).to.equal(5);
  });

  it("renders 'required' violations", () => {
    const lFixture = readFixture(
      "__mocks__/required-errors-teamcity-format.txt"
    );
    const lResult = render(requiredErrs);

    expect(removePerSessionAttributes(lResult.output)).to.equal(
      removePerSessionAttributes(lFixture)
    );
    // eslint-disable-next-line no-magic-numbers
    expect(lResult.exitCode).to.equal(5);
  });

  it("renders circular transgressions", () => {
    const lFixture = readFixture("__mocks__/circular-deps-teamcity-format.txt");
    const lResult = render(circulars);

    expect(removePerSessionAttributes(lResult.output)).to.equal(
      removePerSessionAttributes(lFixture)
    );
    // eslint-disable-next-line no-magic-numbers
    expect(lResult.exitCode).to.equal(3);
  });

  it("renders via transgressions", () => {
    const lFixture = readFixture("__mocks__/via-deps-teamcity-format.txt");
    const lResult = render(vias);

    expect(removePerSessionAttributes(lResult.output)).to.equal(
      removePerSessionAttributes(lFixture)
    );
    // eslint-disable-next-line no-magic-numbers
    expect(lResult.exitCode).to.equal(4);
  });

  it("renders instability transgressions", () => {
    const lFixture = readFixture("__mocks__/instabilities-teamcity-format.txt");
    const lResult = render(instabilities);

    expect(removePerSessionAttributes(lResult.output)).to.equal(
      removePerSessionAttributes(lFixture)
    );

    expect(lResult.exitCode).to.equal(0);
  });

  it("renders unsupported error levels (like 'ignore') as 'info'", () => {
    const lFixture = readFixture(
      "__mocks__/unsupported-severity-teamcity-format.txt"
    );
    const lResult = render(unsupportedErrorLevels);

    expect(removePerSessionAttributes(lResult.output)).to.equal(
      removePerSessionAttributes(lFixture)
    );
    // eslint-disable-next-line no-magic-numbers
    expect(lResult.exitCode).to.equal(5);
  });

  it("renders known errors in a single warning", () => {
    const lFixture = readFixture(
      "__mocks__/known-violations-teamcity-format.txt"
    );
    const lResult = render(knownViolations);

    expect(removePerSessionAttributes(lResult.output)).to.equal(
      removePerSessionAttributes(lFixture)
    );
    expect(lResult.exitCode).to.equal(0);
  });
});
