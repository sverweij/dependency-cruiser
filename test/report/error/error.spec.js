/* eslint-disable no-magic-numbers */
const expect = require("chai").expect;
const chalk = require("chalk");
const render = require("../../../src/report/error");
const okdeps = require("./mocks/everything-fine.json");
const dependencies = require("./mocks/cjs-no-dependency-valid.json");
const onlywarningdependencies = require("./mocks/err-only-warnings.json");
const orphanerrs = require("./mocks/orphan-deps.json");
const circularerrs = require("./mocks/circular-deps.json");
const viaerrs = require("./mocks/via-deps.json");

describe("report/error", () => {
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
    const lResult = render(dependencies);

    expect(lResult.output).to.contain("error no-leesplank: aap → noot\n");
    expect(lResult.output).to.contain(
      "2 dependency violations (2 errors, 0 warnings). 33 modules, 333 dependencies cruised."
    );
    expect(lResult.output).to.not.contain("    comment to no-leesplank");
    expect(lResult.exitCode).to.equal(2);
  });
  it("renders a bunch of warnings", () => {
    const lResult = render(onlywarningdependencies);

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
  it("renders via violations as vias", () => {
    const lResult = render(viaerrs);

    expect(lResult.output).to.contain(
      "error some-via-rule: src/extract/index.js → src/utl/find-rule-by-name.js\n"
    );
    expect(lResult.output).to.contain(
      "error some-via-rule: src/extract/index.js → src/utl/array-util.js\n"
    );
    expect(lResult.output).to.contain("      (via via)");
    expect(lResult.exitCode).to.equal(4);
  });
});
