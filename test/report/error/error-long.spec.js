/* eslint-disable no-magic-numbers */
const curryRight = require("lodash/curryRight");
const { expect } = require("chai");
const chalk = require("chalk");
const okdeps = require("./mocks/everything-fine.json");
const deps = require("./mocks/cjs-no-dependency-valid.json");
const warndeps = require("./mocks/err-only-warnings.json");
const erradds = require("./mocks/err-with-additional-information.json");
const orphanerrs = require("./mocks/orphan-deps.json");
const render = curryRight(require("~/src/report/error"))({ long: true });

describe("report/error-long", () => {
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
