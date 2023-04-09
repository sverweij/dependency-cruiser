import { expect } from "chai";
import utl from "../../../src/report/error-html/utl.mjs";

function summaryHasMinimalAttributes(pResult) {
  expect(pResult).to.haveOwnProperty("depcruiseVersion");
  expect(pResult).to.haveOwnProperty("runDate");
  expect(pResult).to.haveOwnProperty("violations");
}

describe("[U] report/error-html/utl", () => {
  it("getFormattedAllowedRule - no allowed rule available returns empty array", () => {
    expect(utl.getFormattedAllowedRule({})).to.deep.equal([]);
  });

  it("getFormattedAllowedRule - empty allowed array returns empty array", () => {
    expect(utl.getFormattedAllowedRule({ allowed: [] })).to.deep.equal([]);
  });

  it("getFormattedAllowedRule - one rule with no comment, no severity returns default comment & severity", () => {
    expect(
      utl.getFormattedAllowedRule({
        allowed: [{ from: {}, to: {} }],
      })
    ).to.deep.equal({
      name: "not-in-allowed",
      severity: "warn",
      comment: "-",
    });
  });

  it("getFormattedAllowedRule - a rule with a comment, no severity returns that comment & default severity", () => {
    expect(
      utl.getFormattedAllowedRule({
        allowed: [
          {
            from: {
              path: "^(test|src)",
            },
            to: {
              path: "^src",
            },
          },
          {
            comment: "this is a comment",
            from: {
              path: "^bin",
            },
            to: {
              path: "^src/cli",
            },
          },
        ],
      })
    ).to.deep.equal({
      name: "not-in-allowed",
      severity: "warn",
      comment: "this is a comment",
    });
  });

  it("getFormattedAllowedRule - a rule with a severity, no comment returns a default comment & that severity", () => {
    expect(
      utl.getFormattedAllowedRule({
        allowed: [
          {
            from: {
              path: "^(test|src)",
            },
            to: {
              path: "^src",
            },
          },
        ],
        allowedSeverity: "info",
      })
    ).to.deep.equal({
      name: "not-in-allowed",
      severity: "info",
      comment: "-",
    });
  });

  it("mergeCountIntoRule - no violation", () => {
    expect(utl.mergeCountsIntoRule({ name: "blah" }, {})).to.deep.equal({
      name: "blah",
      count: 0,
      ignoredCount: 0,
      unviolated: true,
    });
  });

  it("mergeCountIntoRule - some violations", () => {
    expect(
      utl.mergeCountsIntoRule(
        { name: "blah" },
        { blah: { count: 69, ignoredCount: 0 } }
      )
    ).to.deep.equal({
      name: "blah",
      count: 69,
      ignoredCount: 0,
      unviolated: false,
    });
  });

  it("formatSummaryForReport - empty", () => {
    const lResult = utl.formatSummaryForReport({});

    summaryHasMinimalAttributes(lResult);
    expect(lResult.violations).to.deep.equal([]);
  });

  it("formatSummaryForReport - one module violation", () => {
    const lResult = utl.formatSummaryForReport({
      violations: [
        {
          type: "dependency",
          from: "aap",
          to: "noot",
        },
      ],
    });

    summaryHasMinimalAttributes(lResult);
    expect(lResult.violations).to.deep.equal([
      {
        type: "dependency",
        from: "aap",
        fromExtras: "",
        to: "noot",
      },
    ]);
  });

  it("formatSummaryForReport - one dependency violation", () => {
    const lResult = utl.formatSummaryForReport({
      violations: [
        {
          type: "module",
          from: "aap",
          to: "aap",
        },
      ],
    });

    summaryHasMinimalAttributes(lResult);
    expect(lResult.violations).to.deep.equal([
      {
        type: "module",
        from: "aap",
        fromExtras: "",
        to: "",
      },
    ]);
  });

  it("determineTo - circular violation", () => {
    const lInputViolation = {
      type: "cycle",
      cycle: ["thing/a", "b", "thingy/bingy/c", "a"],
      from: "a",
      to: "thing/a",
    };

    const lExpectation =
      "thing/a &rightarrow;<br/>b &rightarrow;<br/>thingy/bingy/c &rightarrow;<br/>a";

    expect(utl.determineTo(lInputViolation)).to.deep.equal(lExpectation);
  });

  it("determineTo - via violation", () => {
    const lInputViolation = {
      type: "reachability",
      via: ["thing/a", "b", "thingy/bingy/c", "a"],
      from: "a",
      to: "thing/a",
    };

    const lExpectation =
      "thing/a<br/>thing/a &rightarrow;<br/>b &rightarrow;<br/>thingy/bingy/c &rightarrow;<br/>a";

    expect(utl.determineTo(lInputViolation)).to.deep.equal(lExpectation);
  });

  it("determineTo - dependency violation", () => {
    const lInputViolation = {
      type: "dependency",
      from: "a",
      to: "thing/a",
    };

    const lExpectation = "thing/a";

    expect(utl.determineTo(lInputViolation)).to.deep.equal(lExpectation);
  });

  it("determineTo - module violation", () => {
    const lInputViolation = {
      type: "module",
      from: "a",
      to: "a",
    };

    const lExpectation = "";

    expect(utl.determineTo(lInputViolation)).to.deep.equal(lExpectation);
  });

  it("determineTo - instability violation", () => {
    const lInputViolation = {
      type: "instability",
      from: "a",
      to: "b",
      metrics: { from: { instability: 0.1 }, to: { instability: 1 } },
    };

    const lExpectation = 'b&nbsp;<span class="extra">(I: 100%)</span>';

    expect(utl.determineTo(lInputViolation)).to.deep.equal(lExpectation);
  });

  it("determineFromExtras - instability violation", () => {
    const lInputViolation = {
      type: "instability",
      from: "a",
      to: "b",
      metrics: { from: { instability: 0.1 }, to: { instability: 1 } },
    };

    const lExpectation = '&nbsp;<span class="extra">(I: 10%)</span>';

    expect(utl.determineFromExtras(lInputViolation)).to.deep.equal(
      lExpectation
    );
  });
});
