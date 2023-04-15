/* eslint-disable no-magic-numbers */
import { EOL } from "node:os";
import { expect } from "chai";
import chalk from "chalk";
import render from "../../../src/report/error.mjs";
import okdeps from "./__mocks__/everything-fine.mjs";
import dependencies from "./__mocks__/cjs-no-dependency-valid.mjs";
import onlyWarningDependencies from "./__mocks__/err-only-warnings.mjs";
import orphanErrs from "./__mocks__/orphan-deps.mjs";
import circularErrs from "./__mocks__/circular-deps.mjs";
import viaErrs from "./__mocks__/via-deps.mjs";
import sdpErrors from "./__mocks__/sdp-errors.mjs";
import ignoredViolations from "./__mocks__/ignored-violations.mjs";
import ignoredAndRealViolations from "./__mocks__/ignored-and-real-violations.mjs";
import missingViolationType from "./__mocks__/missing-violation-type.mjs";
import unknownViolationType from "./__mocks__/unknown-violation-type.mjs";

describe("[I] report/error", () => {
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

    expect(lResult.output).to.contain(`error no-leesplank: aap → noot${EOL}`);
    expect(lResult.output).to.contain(
      "2 dependency violations (2 errors, 0 warnings). 33 modules, 333 dependencies cruised."
    );
    expect(lResult.output).to.not.contain("    comment to no-leesplank");
    expect(lResult.exitCode).to.equal(2);
  });
  it("renders a bunch of warnings", () => {
    const lResult = render(onlyWarningDependencies);

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
  it("renders circular violations as circulars", () => {
    const lResult = render(circularErrs);

    expect(lResult.output).to.contain(
      `error no-circular: src/some/folder/nested/center.js → ${EOL}`
    );
    // these `\n` look odd - they're a side effect of the wrap-ansi module
    // which replaces `\r\n` with `\n` as part of its parse/ split/ re-assemble
    // operation
    expect(lResult.output).to.contain(
      `      src/some/folder/loop-a.js →\n      src/some/folder/loop-b.js →\n      src/some/folder/nested/center.js`
    );
    expect(lResult.exitCode).to.equal(3);
  });
  it("renders via violations as vias", () => {
    const lResult = render(viaErrs);

    expect(lResult.output).to.contain(
      `error some-via-rule: src/extract/index.js → src/utl/find-rule-by-name.js${EOL}`
    );
    expect(lResult.output).to.contain(
      `error some-via-rule: src/extract/index.js → src/utl/array-util.js${EOL}`
    );
    expect(lResult.output).to.contain("      (via via)");
    expect(lResult.exitCode).to.equal(4);
  });
  it("renders moreUnstable violations with the module & dependents violations", () => {
    const lResult = render(sdpErrors);

    expect(lResult.output).to.contain(
      `warn sdp: src/more-stable.js → src/less-stable.js${EOL}      instability: 42% → 100%${EOL}`
    );
  });
  it("renders a violation as a dependency-violation when the violation.type ain't there", () => {
    const lResult = render(missingViolationType);
    expect(lResult.output).to.contain(`warn missing-type: a.js → b.js${EOL}`);
  });

  it("renders a violation as a dependency-violation when the violation.type is yet unknown", () => {
    const lResult = render(unknownViolationType);
    expect(lResult.output).to.contain(`warn unknown-type: a.js → b.js${EOL}`);
  });
  it("emits a warning when there's > 1 ignored violation and no other violations", () => {
    const lResult = render(ignoredViolations);
    expect(lResult.output).to.contain("no dependency violations found");
    expect(lResult.output).to.contain(
      "11 known violations ignored. Run with --no-ignore-known to see them."
    );
  });
  it("emits a warning when there's > 1 ignored violation and at least one other violation", () => {
    const lResult = render(ignoredAndRealViolations);

    expect(lResult.output).to.contain(
      "warn no-orphans: test/extract/ast-extractors/typescript2.8-union-types-ast.json"
    );
    expect(lResult.output).to.contain(
      "1 dependency violations (0 errors, 1 warnings)"
    );
    expect(lResult.output).to.contain(
      "10 known violations ignored. Run with --no-ignore-known to see them."
    );
  });
});
