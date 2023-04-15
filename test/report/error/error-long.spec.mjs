/* eslint-disable no-magic-numbers */
import { EOL } from "node:os";
import { expect } from "chai";
import chalk from "chalk";
import render from "../../../src/report/error-long.mjs";
import okDeps from "./__mocks__/everything-fine.mjs";
import deps from "./__mocks__/cjs-no-dependency-valid.mjs";
import warnDeps from "./__mocks__/err-only-warnings.mjs";
import errorsAdditionalInfo from "./__mocks__/err-with-additional-information.mjs";
import orphanErrs from "./__mocks__/orphan-deps.mjs";

describe("[I] report/error-long", () => {
  let chalkLevel = chalk.level;

  before("disable chalk coloring", () => {
    chalk.level = 0;
  });
  after("put chalk enabled back to its original value", () => {
    chalk.level = chalkLevel;
  });
  it("says everything fine", () => {
    const lResult = render(okDeps);

    expect(lResult.output).to.contain("no dependency violations found");
    expect(lResult.exitCode).to.equal(0);
  });
  it("renders a bunch of errors", () => {
    const lResult = render(deps);

    expect(lResult.output).to.contain(`error no-leesplank: aap → noot${EOL}`);
    expect(lResult.output).to.contain(
      "2 dependency violations (2 errors, 0 warnings). 33 modules, 333 dependencies cruised."
    );
    expect(lResult.output).to.contain("    comment to no-leesplank");
    expect(lResult.exitCode).to.equal(2);
  });
  it("renders a bunch of warnings", () => {
    const lResult = render(warnDeps);

    expect(lResult.output).to.contain(
      "1 dependency violations (0 errors, 1 warnings)"
    );
    expect(lResult.exitCode).to.equal(0);
  });
  it("renders module only violations as module only", () => {
    const lResult = render(orphanErrs);

    expect(lResult.output).to.contain(`error no-orphans: remi.js${EOL}`);
    expect(lResult.output).to.contain(
      "1 dependency violations (1 errors, 0 warnings). 1 modules, 0 dependencies cruised."
    );
    expect(lResult.exitCode).to.equal(1);
  });
  it("renders a '-' for comment if it couldn't find the rule", () => {
    const lResult = render(errorsAdditionalInfo);

    expect(lResult.output).to.contain("    -");
  });
});
