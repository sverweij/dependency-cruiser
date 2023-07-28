/* eslint-disable security/detect-non-literal-regexp */
/* eslint-disable no-magic-numbers */
import { strictEqual, match } from "node:assert";
import { EOL } from "node:os";
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

    match(lResult.output, /no dependency violations found/);
    strictEqual(lResult.exitCode, 0);
  });
  it("renders a bunch of errors", () => {
    const lResult = render(deps);

    match(lResult.output, new RegExp(`error no-leesplank: aap → noot${EOL}`));
    match(
      lResult.output,
      /2 dependency violations \(2 errors, 0 warnings\)\. 33 modules, 333 dependencies cruised\./,
    );
    match(lResult.output, / {4}comment to no-leesplank/);
    strictEqual(lResult.exitCode, 2);
  });
  it("renders a bunch of warnings", () => {
    const lResult = render(warnDeps);

    match(lResult.output, /1 dependency violations \(0 errors, 1 warnings\)/);
    strictEqual(lResult.exitCode, 0);
  });
  it("renders module only violations as module only", () => {
    const lResult = render(orphanErrs);

    match(lResult.output, new RegExp(`error no-orphans: remi.js${EOL}`));
    match(
      lResult.output,
      /1 dependency violations \(1 errors, 0 warnings\)\. 1 modules, 0 dependencies cruised\./,
    );
    strictEqual(lResult.exitCode, 1);
  });
  it("renders a '-' for comment if it couldn't find the rule", () => {
    const lResult = render(errorsAdditionalInfo);

    match(lResult.output, / {4}-/);
  });
});
