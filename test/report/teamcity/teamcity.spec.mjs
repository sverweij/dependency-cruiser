import { equal } from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import okdeps from "./__mocks__/everything-fine.mjs";
import moduleErrs from "./__mocks__/module-errors.mjs";
import requiredErrs from "./__mocks__/required-errors.mjs";
import circulars from "./__mocks__/circular-deps.mjs";
import vias from "./__mocks__/via-deps.mjs";
import unsupportedErrorLevels from "./__mocks__/unsupported-severity.mjs";
import knownViolations from "./__mocks__/known-violations.mjs";
import instabilities from "./__mocks__/instabilities.mjs";
import render from "#report/teamcity.mjs";

function removePerSessionAttributes(pString) {
  return pString.replace(/ flowId='[^']+' timestamp='[^']+'/g, "");
}

function readFixture(pRelativePath) {
  return readFileSync(
    fileURLToPath(new URL(pRelativePath, import.meta.url)),
    "utf8",
  );
}
describe("[I] report/teamcity", () => {
  it("says everything fine when everything is fine", () => {
    const lFixture = readFixture(
      "__mocks__/everything-fine-teamcity-format.txt",
    );
    const lResult = render(okdeps);

    equal(
      removePerSessionAttributes(lResult.output),
      removePerSessionAttributes(lFixture),
    );
    equal(lResult.exitCode, 0);
  });

  it("renders module only transgressions", () => {
    const lFixture = readFixture("__mocks__/module-errors-teamcity-format.txt");
    const lResult = render(moduleErrs);

    equal(
      removePerSessionAttributes(lResult.output),
      removePerSessionAttributes(lFixture),
    );
    equal(
      removePerSessionAttributes(lResult.output),
      removePerSessionAttributes(lFixture),
    );
    // eslint-disable-next-line no-magic-numbers
    equal(lResult.exitCode, 5);
  });

  it("renders 'required' violations", () => {
    const lFixture = readFixture(
      "__mocks__/required-errors-teamcity-format.txt",
    );
    const lResult = render(requiredErrs);

    equal(
      removePerSessionAttributes(lResult.output),
      removePerSessionAttributes(lFixture),
    );
    // eslint-disable-next-line no-magic-numbers
    equal(lResult.exitCode, 5);
  });

  it("renders circular transgressions", () => {
    const lFixture = readFixture("__mocks__/circular-deps-teamcity-format.txt");
    const lResult = render(circulars);

    equal(
      removePerSessionAttributes(lResult.output),
      removePerSessionAttributes(lFixture),
    );
    // eslint-disable-next-line no-magic-numbers
    equal(lResult.exitCode, 3);
  });

  it("renders via transgressions", () => {
    const lFixture = readFixture("__mocks__/via-deps-teamcity-format.txt");
    const lResult = render(vias);

    equal(
      removePerSessionAttributes(lResult.output),
      removePerSessionAttributes(lFixture),
    );
    // eslint-disable-next-line no-magic-numbers
    equal(lResult.exitCode, 4);
  });

  it("renders instability transgressions", () => {
    const lFixture = readFixture("__mocks__/instabilities-teamcity-format.txt");
    const lResult = render(instabilities);

    equal(
      removePerSessionAttributes(lResult.output),
      removePerSessionAttributes(lFixture),
    );

    equal(lResult.exitCode, 0);
  });

  it("renders unsupported error levels (like 'ignore') as 'info'", () => {
    const lFixture = readFixture(
      "__mocks__/unsupported-severity-teamcity-format.txt",
    );
    const lResult = render(unsupportedErrorLevels);

    equal(
      removePerSessionAttributes(lResult.output),
      removePerSessionAttributes(lFixture),
    );
    // eslint-disable-next-line no-magic-numbers
    equal(lResult.exitCode, 5);
  });

  it("writes flowIds, and writes them as 10 digit numbers", () => {
    const lResult = render(moduleErrs);
    const lFlowIdRegex = / flowId='\d{10}'/;
    const lFlowIdMatch = lResult.output.match(lFlowIdRegex);
    equal(lFlowIdMatch.length, 1);
    // eslint-disable-next-line no-magic-numbers
    equal(lFlowIdMatch[0].length, 20);
  });

  it("writes timestamps in the team city specific format omitting the 'Z' at the end", () => {
    const lResult = render(moduleErrs);
    // 2025-08-02T19:43:28.893
    const lTimestampRegex =
      / timestamp='\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}[.]\d{3}'/;
    const lTimestampMatch = lResult.output.match(lTimestampRegex);
    equal(lTimestampMatch.length, 1);
    // eslint-disable-next-line no-magic-numbers
    equal(lTimestampMatch[0].length, 36);
  });

  it("renders known errors in a single warning", () => {
    const lFixture = readFixture(
      "__mocks__/known-violations-teamcity-format.txt",
    );
    const lResult = render(knownViolations);

    equal(
      removePerSessionAttributes(lResult.output),
      removePerSessionAttributes(lFixture),
    );
    equal(lResult.exitCode, 0);
  });
});
