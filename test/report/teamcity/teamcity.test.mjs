import { strictEqual } from "node:assert";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
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

    strictEqual(
      removePerSessionAttributes(lResult.output),
      removePerSessionAttributes(lFixture)
    );
    strictEqual(lResult.exitCode, 0);
  });

  it("renders module only transgressions", () => {
    const lFixture = readFixture("__mocks__/module-errors-teamcity-format.txt");
    const lResult = render(moduleErrs);

    strictEqual(
      removePerSessionAttributes(lResult.output),
      removePerSessionAttributes(lFixture)
    );
    strictEqual(
      removePerSessionAttributes(lResult.output),
      removePerSessionAttributes(lFixture)
    );
    // eslint-disable-next-line no-magic-numbers
    strictEqual(lResult.exitCode, 5);
  });

  it("renders 'required' violations", () => {
    const lFixture = readFixture(
      "__mocks__/required-errors-teamcity-format.txt"
    );
    const lResult = render(requiredErrs);

    strictEqual(
      removePerSessionAttributes(lResult.output),
      removePerSessionAttributes(lFixture)
    );
    // eslint-disable-next-line no-magic-numbers
    strictEqual(lResult.exitCode, 5);
  });

  it("renders circular transgressions", () => {
    const lFixture = readFixture("__mocks__/circular-deps-teamcity-format.txt");
    const lResult = render(circulars);

    strictEqual(
      removePerSessionAttributes(lResult.output),
      removePerSessionAttributes(lFixture)
    );
    // eslint-disable-next-line no-magic-numbers
    strictEqual(lResult.exitCode, 3);
  });

  it("renders via transgressions", () => {
    const lFixture = readFixture("__mocks__/via-deps-teamcity-format.txt");
    const lResult = render(vias);

    strictEqual(
      removePerSessionAttributes(lResult.output),
      removePerSessionAttributes(lFixture)
    );
    // eslint-disable-next-line no-magic-numbers
    strictEqual(lResult.exitCode, 4);
  });

  it("renders instability transgressions", () => {
    const lFixture = readFixture("__mocks__/instabilities-teamcity-format.txt");
    const lResult = render(instabilities);

    strictEqual(
      removePerSessionAttributes(lResult.output),
      removePerSessionAttributes(lFixture)
    );

    strictEqual(lResult.exitCode, 0);
  });

  it("renders unsupported error levels (like 'ignore') as 'info'", () => {
    const lFixture = readFixture(
      "__mocks__/unsupported-severity-teamcity-format.txt"
    );
    const lResult = render(unsupportedErrorLevels);

    strictEqual(
      removePerSessionAttributes(lResult.output),
      removePerSessionAttributes(lFixture)
    );
    // eslint-disable-next-line no-magic-numbers
    strictEqual(lResult.exitCode, 5);
  });

  it("renders known errors in a single warning", () => {
    const lFixture = readFixture(
      "__mocks__/known-violations-teamcity-format.txt"
    );
    const lResult = render(knownViolations);

    strictEqual(
      removePerSessionAttributes(lResult.output),
      removePerSessionAttributes(lFixture)
    );
    strictEqual(lResult.exitCode, 0);
  });
});
