/* eslint-disable no-magic-numbers */
const expect = require("chai").expect;
const chalk = require("chalk");
const render = require("../../../src/report/err/err");
const okdeps = require("../fixtures/everything-fine.json");
const deps = require("../fixtures/cjs-no-dependency-valid.json");
const warndeps = require("../fixtures/err-only-warnings.json");
const erradds = require("../fixtures/err-with-additional-information.json");
const orphanerrs = require("../fixtures/orphan-deps.json");
const circularerrs = require("../fixtures/circular-deps.json");

describe("report/err", () => {
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
    expect(lResult.output).to.not.contain("    comment to no-leesplank");
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
  it("renders circular violations as circulars", () => {
    const lResult = render(circularerrs);

    expect(lResult.output).to.contain(
      "error no-circular: src/some/folder/nested/center.js → \n"
    );
    expect(lResult.output).to.contain(
      "      src/some/folder/loop-a.js →\n      src/some/folder/loop-b.js →\n      src/some/folder/nested/center.js"
    );
    expect(lResult.exitCode).to.equal(3);
  });
  it("renders addtional information", () => {
    const lResult = render(erradds);

    expect(lResult.output).to.contain("aap -> noot -> mies -> aap");
  });
});
