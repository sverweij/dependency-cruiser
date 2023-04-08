import { expect } from "chai";
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

    expect(lResult.output).to.contain(lDefaultTitle);
    expect(lResult.output).to.contain(lDefaultSummaryHeader);
    expect(lResult.output).to.contain(lOkeliDokelyKey);
    expect(lResult.output).to.contain(lOkeliDokelyHeader);
    expect(lResult.exitCode).to.equal(0);
  });

  it("happy day no errors - custom options", () => {
    const lCustomSummaryHeader = "Aap noot mies";
    const lResult = markdown(everythingFineResult, {
      showTitle: false,
      summaryHeader: lCustomSummaryHeader,
    });

    expect(lResult.output).to.not.contain(lDefaultTitle);
    expect(lResult.output).to.not.contain(lDefaultSummaryHeader);
    expect(lResult.output).to.contain(lCustomSummaryHeader);
    expect(lResult.output).to.contain(lOkeliDokelyKey);
    expect(lResult.output).to.contain(lOkeliDokelyHeader);
    expect(lResult.exitCode).to.equal(0);
  });

  it("report with errors", () => {
    const lReport = markdown(validationMoreThanOnce);

    expect(lReport.output).to.not.contain(lOkeliDokelyKey);
    expect(lReport.output).to.not.contain(lOkeliDokelyHeader);
    expect(lReport.output).to.contain("<details>");
    expect(lReport.output).to.contain("All violations");
    expect(lReport.output).to.contain("**127** modules");
    expect(lReport.output).to.contain("**259** dependencies");
    expect(lReport.output).to.contain("**0** errors");
    expect(lReport.output).to.contain("**1** warnings");
    expect(lReport.output).to.contain("**2** informational");

    expect(lReport.exitCode).to.equal(0);
  });

  it("report with errors - custom options", () => {
    const lReport = markdown(validationMoreThanOnce, {
      collapseDetails: false,
    });

    expect(lReport.output).to.not.contain(lOkeliDokelyKey);
    expect(lReport.output).to.not.contain(lOkeliDokelyHeader);
    expect(lReport.output).to.not.contain("<details>");
    expect(lReport.output).to.contain("All violations");
    expect(lReport.output).to.contain("**127** modules");
    expect(lReport.output).to.contain("**259** dependencies");
    expect(lReport.output).to.contain("**0** errors");
    expect(lReport.output).to.contain("**1** warnings");
    expect(lReport.output).to.contain("**2** informational");

    expect(lReport.exitCode).to.equal(0);
  });

  it("report with violations and ignored violations", () => {
    const lReport = markdown(validationMoreThanOnceWithAnIgnore);

    expect(lReport.output).to.not.contain(lOkeliDokelyKey);
    expect(lReport.output).to.not.contain(lOkeliDokelyHeader);
    expect(lReport.output).to.contain("All violations");
    expect(lReport.output).to.contain("**127** modules");
    expect(lReport.output).to.contain("**259** dependencies");
    expect(lReport.output).to.contain("**0** errors");
    expect(lReport.output).to.contain("**0** warnings");
    expect(lReport.output).to.contain("**1** informational");
    expect(lReport.output).to.contain("**2** ignored");
    expect(lReport.output).to.contain(
      "|:warning:&nbsp;_cli-to-main-only-warn_|**0**|**1**|"
    );
    expect(lReport.output).to.contain(
      ":see_no_evil:&nbsp;_cli-to-main-only-warn_"
    );
    expect(lReport.output).to.contain("src/cli/compileConfig/index.js");

    expect(lReport.exitCode).to.equal(0);
  });

  it("report with violations and ignored violations hidden", () => {
    const lReport = markdown(validationMoreThanOnceWithAnIgnore, {
      includeIgnoredInSummary: false,
      includeIgnoredInDetails: false,
    });

    expect(lReport.output).to.not.contain(lOkeliDokelyKey);
    expect(lReport.output).to.not.contain(lOkeliDokelyHeader);
    expect(lReport.output).to.contain("All violations");
    expect(lReport.output).to.contain("**127** modules");
    expect(lReport.output).to.contain("**259** dependencies");
    expect(lReport.output).to.contain("**0** errors");
    expect(lReport.output).to.contain("**0** warnings");
    expect(lReport.output).to.contain("**1** informational");
    expect(lReport.output).to.contain("**2** ignored");
    expect(lReport.output).to.not.contain(
      "|:warning:&nbsp;_cli-to-main-only-warn_|**0**|**1**|"
    );
    expect(lReport.output).to.not.contain(
      ":see_no_evil:&nbsp;_cli-to-main-only-warn_"
    );
    expect(lReport.output).to.not.contain("src/cli/compileConfig/index.js");

    expect(lReport.exitCode).to.equal(0);
  });

  it("report nicely on orphans, cycles and metric rules", () => {
    const lResult = markdown(orphansCyclesMetrics);

    expect(lResult.output).to.contain(lDefaultTitle);
    expect(lResult.output).to.contain(lDefaultSummaryHeader);
    expect(lResult.output).to.not.contain(lOkeliDokelyKey);
    expect(lResult.output).to.not.contain(lOkeliDokelyHeader);

    // empty 'to' column for module only rules
    expect(lResult.output).to.contain(
      "|:exclamation:&nbsp;_no-orphans_|src/schema/baseline-violations.schema.js||"
    );
    // cycles as cycles in the 'to' column:
    expect(lResult.output).to.contain(
      "|:warning:&nbsp;_no-folder-cycles_|src/extract/parse|src/extract/transpile &rightarrow;<br/>src/extract/parse|"
    );
    // metrics violations with the 'instability' for the involved modules in:
    expect(lResult.output).to.contain(
      '|:grey_exclamation:&nbsp;_SDP_|src/extract/gather-initial-sources.js&nbsp;<span class="extra">(I: 75%)</span>|src/extract/transpile/meta.js&nbsp;<span class="extra">(I: 80%)</span>|'
    );
  });
});
