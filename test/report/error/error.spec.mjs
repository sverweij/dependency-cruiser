/* eslint-disable security/detect-non-literal-regexp */
/* eslint-disable no-magic-numbers */
import { doesNotMatch, match, equal } from "node:assert/strict";
import { EOL } from "node:os";
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
import render from "#report/error.mjs";

describe("[I] report/error", () => {
  it("says everything fine", () => {
    const lResult = render(okdeps);

    match(lResult.output, /no dependency violations found/);
    equal(lResult.exitCode, 0);
  });
  it("renders a bunch of errors", () => {
    const lResult = render(dependencies);

    match(lResult.output, new RegExp(`error no-leesplank: aap → noot${EOL}`));
    match(
      lResult.output,
      /2 dependency violations \(2 errors, 0 warnings\)\. 33 modules, 333 dependencies cruised\./,
    );
    doesNotMatch(lResult.output, / {4}comment to no-leesplank/);
    equal(lResult.exitCode, 2);
  });
  it("renders a bunch of warnings", () => {
    const lResult = render(onlyWarningDependencies);

    match(lResult.output, /1 dependency violations \(0 errors, 1 warnings\)/);
    equal(lResult.exitCode, 0);
  });
  it("renders module only violations as module only", () => {
    const lResult = render(orphanErrs);

    match(lResult.output, new RegExp(`error no-orphans: remi.js${EOL}`));
    match(
      lResult.output,
      /1 dependency violations \(1 errors, 0 warnings\). 1 modules, 0 dependencies cruised\./,
    );
    equal(lResult.exitCode, 1);
  });
  it("renders circular violations as circulars", () => {
    const lResult = render(circularErrs);

    match(
      lResult.output,
      new RegExp(
        `error no-circular: src/some/folder/nested/center.js → ${EOL}`,
      ),
    );
    // these `\n` look odd - they're a side effect of the wrap-ansi module
    // which replaces `\r\n` with `\n` as part of its parse/ split/ re-assemble
    // operation
    match(
      lResult.output,
      // eslint-disable-next-line prefer-regex-literals
      new RegExp(
        `      src/some/folder/loop-a.js →\n      src/some/folder/loop-b.js →\n      src/some/folder/nested/center.js`,
      ),
    );
    equal(lResult.exitCode, 3);
  });
  it("renders via violations as vias", () => {
    const lResult = render(viaErrs);

    match(
      lResult.output,
      new RegExp(
        `error some-via-rule: src/extract/index.js → src/utl/find-rule-by-name.js${EOL}`,
      ),
    );
    match(
      lResult.output,
      new RegExp(
        `error some-via-rule: src/extract/index.js → src/utl/array-util.js${EOL}`,
      ),
    );
    match(lResult.output, / {6}\(via via\)/);
    equal(lResult.exitCode, 4);
  });
  it("renders moreUnstable violations with the module & dependents violations", () => {
    const lResult = render(sdpErrors);

    match(
      lResult.output,
      new RegExp(
        `warn sdp: src/more-stable.js → src/less-stable.js${EOL}      instability: 42% → 100%${EOL}`,
      ),
    );
  });
  it("renders a violation as a dependency-violation when the violation.type ain't there", () => {
    const lResult = render(missingViolationType);
    match(lResult.output, new RegExp(`warn missing-type: a.js → b.js${EOL}`));
  });

  it("renders a violation as a dependency-violation when the violation.type is yet unknown", () => {
    const lResult = render(unknownViolationType);
    match(lResult.output, new RegExp(`warn unknown-type: a.js → b.js${EOL}`));
  });
  it("emits a warning when there's > 1 ignored violation and no other violations", () => {
    const lResult = render(ignoredViolations);
    match(lResult.output, /no dependency violations found/);
    match(
      lResult.output,
      /11 known violations ignored. Run with --no-ignore-known to see them\./,
    );
  });
  it("emits a warning when there's > 1 ignored violation and at least one other violation", () => {
    const lResult = render(ignoredAndRealViolations);

    match(
      lResult.output,
      /warn no-orphans: test\/extract\/ast-extractors\/typescript2.8-union-types-ast.json/,
    );
    match(lResult.output, /1 dependency violations \(0 errors, 1 warnings\)/);
    match(
      lResult.output,
      /10 known violations ignored. Run with --no-ignore-known to see them\./,
    );
  });
});
