/* eslint-disable no-magic-numbers */
import { expect } from "chai";
import chalk from "chalk";
import render from "../../../src/report/error-long.mjs";
import okdeps from "./__mocks__/everything-fine.mjs";
import deps from "./__mocks__/cjs-no-dependency-valid.mjs";
import warndeps from "./__mocks__/err-only-warnings.mjs";
import erradds from "./__mocks__/err-with-additional-information.mjs";
import orphanerrs from "./__mocks__/orphan-deps.mjs";

describe("[I] report/error-long", () => {
  let chalkLevel = chalk.level;

  before("disable chalk coloring", () => {
    chalk.level = 0;
  });
  after("put chalk enabled back to its original value", () => {
    chalk.level = chalkLevel;
  });
  it("says everything fine", () => {
    const lResult = render(okdeps);

    expect(lResult.output).to.contain("no dependency violations found");
    expect(lResult.exitCode).to.equal(0);
  });
  it("renders a bunch of errors", () => {
    const lResult = render(deps);

    expect(lResult.output).to.contain("error no-leesplank: aap → noot\n");
    expect(lResult.output).to.contain(
      "2 dependency violations (2 errors, 0 warnings). 33 modules, 333 dependencies cruised."
    );
    expect(lResult.output).to.contain("    comment to no-leesplank");
    expect(lResult.exitCode).to.equal(2);
  });
  it("renders a bunch of warnings", () => {
    const lResult = render(warndeps);

    expect(lResult.output).to.contain(
      "1 dependency violations (0 errors, 1 warnings)"
    );
    expect(lResult.exitCode).to.equal(0);
  });
  it("renders module only violations as module only", () => {
    const lResult = render(orphanerrs);

    expect(lResult.output).to.contain("error no-orphans: remi.js\n");
    expect(lResult.output).to.contain(
      "1 dependency violations (1 errors, 0 warnings). 1 modules, 0 dependencies cruised."
    );
    expect(lResult.exitCode).to.equal(1);
  });
  it("renders a '-' for comment if it couldn't find the rule", () => {
    const lResult = render(erradds);

    expect(lResult.output).to.contain("    -");
  });
});
