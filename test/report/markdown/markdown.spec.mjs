/* eslint-disable prefer-regex-literals */
import { match, doesNotMatch, equal } from "node:assert/strict";
import markdown from "../../../src/report/markdown.mjs";
import everythingFineResult from "./__mocks__/everything-fine.mjs";
import validationMoreThanOnce from "./__mocks__/violation-more-than-once.mjs";
import validationMoreThanOnceWithAnIgnore from "./__mocks__/violation-more-than-once-with-an-ignore.mjs";
import orphansCyclesMetrics from "./__mocks__/orphans-cycles-metrics.mjs";

describe("[I] report/markdown", () => {
  const lOkeliDokelyKey = "gummy bears";
  const lOkeliDokelyHeader = "No violations found";
  const lDefaultTitle = "## Forbidden dependency check - results";
  const lDefaultSummaryHeader = "### :chart_with_upwards_trend: Summary";

  it("happy day no errors", () => {
    const lResult = markdown(everythingFineResult);

    match(lResult.output, new RegExp(lDefaultTitle));
    match(lResult.output, new RegExp(lDefaultSummaryHeader));
    match(lResult.output, new RegExp(lOkeliDokelyKey));
    match(lResult.output, new RegExp(lOkeliDokelyHeader));
    equal(lResult.exitCode, 0);
  });

  it("happy day no errors - custom options", () => {
    const lCustomSummaryHeader = "Aap noot mies";
    const lResult = markdown(everythingFineResult, {
      showTitle: false,
      summaryHeader: lCustomSummaryHeader,
    });

    doesNotMatch(lResult.output, new RegExp(lDefaultTitle));
    doesNotMatch(lResult.output, new RegExp(lDefaultSummaryHeader));
    match(lResult.output, new RegExp(lCustomSummaryHeader));
    match(lResult.output, new RegExp(lOkeliDokelyKey));
    match(lResult.output, new RegExp(lOkeliDokelyHeader));
    equal(lResult.exitCode, 0);
  });

  it("report with errors", () => {
    const lResult = markdown(validationMoreThanOnce);

    doesNotMatch(lResult.output, new RegExp(lOkeliDokelyKey));
    doesNotMatch(lResult.output, new RegExp(lOkeliDokelyHeader));
    match(lResult.output, /<details>/);
    match(lResult.output, /All violations/);
    match(lResult.output, /\*\*127\*\* modules/);
    match(lResult.output, /\*\*259\*\* dependencies/);
    match(lResult.output, /\*\*0\*\* errors/);
    match(lResult.output, /\*\*1\*\* warnings/);
    match(lResult.output, /\*\*2\*\* informational/);

    equal(lResult.exitCode, 0);
  });

  it("report with errors - custom options", () => {
    const lResult = markdown(validationMoreThanOnce, {
      collapseDetails: false,
    });

    doesNotMatch(lResult.output, new RegExp(lOkeliDokelyKey));
    doesNotMatch(lResult.output, new RegExp(lOkeliDokelyHeader));
    doesNotMatch(lResult.output, /<details>/);
    match(lResult.output, /All violations/);
    match(lResult.output, /\*\*127\*\* modules/);
    match(lResult.output, /\*\*259\*\* dependencies/);
    match(lResult.output, /\*\*0\*\* errors/);
    match(lResult.output, /\*\*1\*\* warnings/);
    match(lResult.output, /\*\*2\*\* informational/);

    equal(lResult.exitCode, 0);
  });

  it("report with violations and ignored violations", () => {
    const lResult = markdown(validationMoreThanOnceWithAnIgnore);

    doesNotMatch(lResult.output, new RegExp(lOkeliDokelyKey));
    doesNotMatch(lResult.output, new RegExp(lOkeliDokelyHeader));
    match(lResult.output, /All violations/);
    match(lResult.output, /\*\*127\*\* modules/);
    match(lResult.output, /\*\*259\*\* dependencies/);
    match(lResult.output, /\*\*0\*\* errors/);
    match(lResult.output, /\*\*0\*\* warnings/);
    match(lResult.output, /\*\*1\*\* informational/);
    match(lResult.output, /\*\*2\*\* ignored/);
    match(
      lResult.output,
      /|:warning:&nbsp;_cli-to-main-only-warn_|\*\*0\*\*|\*\*1\*\*|/,
    );
    match(lResult.output, /:see_no_evil:&nbsp;_cli-to-main-only-warn_/);
    match(lResult.output, /src\/cli\/compileConfig\/index\.js/);

    equal(lResult.exitCode, 0);
  });

  it("report with violations and ignored violations hidden", () => {
    const lResult = markdown(validationMoreThanOnceWithAnIgnore, {
      includeIgnoredInSummary: false,
      includeIgnoredInDetails: false,
    });

    doesNotMatch(lResult.output, new RegExp(lOkeliDokelyKey));
    doesNotMatch(lResult.output, new RegExp(lOkeliDokelyHeader));
    match(lResult.output, /All violations/);
    match(lResult.output, /\*\*127\*\* modules/);
    match(lResult.output, /\*\*259\*\* dependencies/);
    match(lResult.output, /\*\*0\*\* errors/);
    match(lResult.output, /\*\*0\*\* warnings/);
    match(lResult.output, /\*\*1\*\* informational/);
    match(lResult.output, /\*\*2\*\* ignored/);
    doesNotMatch(
      lResult.output,
      /\|:warning:&nbsp;_cli-to-main-only-warn_\|\*\*0*\*\|\*\*1*\*\|/,
    );
    doesNotMatch(
      lResult.output,
      new RegExp(":see_no_evil:&nbsp;_cli-to-main-only-warn_"),
    );
    doesNotMatch(lResult.output, new RegExp("src/cli/compileConfig/index.js"));

    equal(lResult.exitCode, 0);
  });

  it("report nicely on orphans, cycles and metric rules", () => {
    const lResult = markdown(orphansCyclesMetrics);

    match(lResult.output, new RegExp(lDefaultTitle));
    match(lResult.output, new RegExp(lDefaultSummaryHeader));
    doesNotMatch(lResult.output, new RegExp(lOkeliDokelyKey));
    doesNotMatch(lResult.output, new RegExp(lOkeliDokelyHeader));

    // empty 'to' column for module only rules
    match(
      lResult.output,
      /|:exclamation:&nbsp;_no-orphans_|src\/schema\/baseline-violations.schema.js||/,
    );
    // cycles as cycles in the 'to' column:
    match(
      lResult.output,
      /|:warning:&nbsp;_no-folder-cycles_|src\/extract\/parse|src\/extract\/transpile &rightarrow;<br\/>src\/extract\/parse|/,
    );
    // metrics violations with the 'instability' for the involved modules in:
    match(
      lResult.output,
      /|:grey_exclamation:&nbsp;_SDP_|src\/extract\/gather-initial-sources.js&nbsp;<span class="extra">(I: 75%)<\/span>|src\/extract\/transpile\/meta.js&nbsp;<span class="extra">(I: 80%)<\/span>|/,
    );
  });
});
