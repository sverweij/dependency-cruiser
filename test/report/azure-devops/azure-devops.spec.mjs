import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { expect } from "chai";
import normalizeNewline from "normalize-newline";
import render from "../../../src/report/azure-devops.mjs";
import okdeps from "./__mocks__/everything-fine.mjs";
import warndeps from "./__mocks__/there-are-warnings.mjs";
import errdeps from "./__mocks__/there-are-errors.mjs";
import moduleErrs from "./__mocks__/module-errors.mjs";
// import requiredErrs from "./__mocks__/required-errors.mjs";
// import circulars from "./__mocks__/circular-deps.mjs";
// import vias from "./__mocks__/via-deps.mjs";
// import unsupportedErrorLevels from "./__mocks__/unsupported-severity.mjs";
// import knownViolations from "./__mocks__/known-violations.mjs";
// import instabilities from "./__mocks__/instabilities.mjs";

function readFixture(pRelativePath) {
  return readFileSync(
    fileURLToPath(new URL(pRelativePath, import.meta.url)),
    "utf8"
  );
}
describe("[I] report/azure-devops", () => {
  it("says everything fine when everything is fine", () => {
    const lFixture = readFixture(
      "__mocks__/everything-fine-azure-devops-format.txt"
    );
    const lResult = render(okdeps);

    expect(normalizeNewline(lResult.output)).to.equal(
      normalizeNewline(lFixture)
    );
    expect(lResult.exitCode).to.equal(0);
  });

  it("says there's warnings when there's warnings", () => {
    const lFixture = readFixture(
      "__mocks__/there-are-warnings-azure-devops-format.txt"
    );
    const lResult = render(warndeps);

    expect(normalizeNewline(lResult.output)).to.equal(
      normalizeNewline(lFixture)
    );
    expect(lResult.exitCode).to.equal(0);
  });

  it("says there's errors when there's errors", () => {
    const lFixture = readFixture(
      "__mocks__/there-are-errors-azure-devops-format.txt"
    );
    const lResult = render(errdeps);

    expect(normalizeNewline(lResult.output)).to.equal(
      normalizeNewline(lFixture)
    );
    expect(lResult.exitCode).to.equal(1);
  });

  it("renders module only transgressions", () => {
    const lFixture = readFixture(
      "__mocks__/module-errors-azure-devops-format.txt"
    );
    const lResult = render(moduleErrs);

    expect(lResult.output).to.equal(lFixture);
    // eslint-disable-next-line no-magic-numbers
    expect(lResult.exitCode).to.equal(5);
  });

  //   it("renders 'required' violations", () => {
  //     const lFixture = readFixture(
  //       "__mocks__/required-errors-azure-devops-format.txt"
  //     );
  //     const lResult = render(requiredErrs);

  //     expect(lResult.output).to.equal(lFixture);
  //     // eslint-disable-next-line no-magic-numbers
  //     expect(lResult.exitCode).to.equal(5);
  //   });

  //   it("renders circular transgressions", () => {
  //     const lFixture = readFixture(
  //       "__mocks__/circular-deps-azure-devops-format.txt"
  //     );
  //     const lResult = render(circulars);

  //     expect(lResult.output).to.equal(lFixture);
  //     // eslint-disable-next-line no-magic-numbers
  //     expect(lResult.exitCode).to.equal(3);
  //   });

  //   it("renders via transgressions", () => {
  //     const lFixture = readFixture("__mocks__/via-deps-azure-devops-format.txt");
  //     const lResult = render(vias);

  //     expect(lResult.output).to.equal(lFixture);
  //     // eslint-disable-next-line no-magic-numbers
  //     expect(lResult.exitCode).to.equal(4);
  //   });

  //   it("renders instability transgressions", () => {
  //     const lFixture = readFixture(
  //       "__mocks__/instabilities-azure-devops-format.txt"
  //     );
  //     const lResult = render(instabilities);

  //     expect(lResult.output).to.equal(lFixture);

  //     expect(lResult.exitCode).to.equal(0);
  //   });

  //   it("renders unsupported error levels (like 'ignore') as 'info'", () => {
  //     const lFixture = readFixture(
  //       "__mocks__/unsupported-severity-azure-devops-format.txt"
  //     );
  //     const lResult = render(unsupportedErrorLevels);

  //     expect(lResult.output).to.equal(lFixture);
  //     // eslint-disable-next-line no-magic-numbers
  //     expect(lResult.exitCode).to.equal(5);
  //   });

  //   it("renders known errors in a single warning", () => {
  //     const lFixture = readFixture(
  //       "__mocks__/known-violations-azure-devops-format.txt"
  //     );
  //     const lResult = render(knownViolations);

  //     expect(lResult.output).to.equal(lFixture);
  //     expect(lResult.exitCode).to.equal(0);
  //   });
});
