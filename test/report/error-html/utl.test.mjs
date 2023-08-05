import { deepStrictEqual, strictEqual } from "node:assert";
import { describe, it } from "node:test";
import utl from "../../../src/report/error-html/utl.mjs";

function summaryHasMinimalAttributes(pResult) {
  strictEqual(pResult.hasOwnProperty("depcruiseVersion"), true);
  strictEqual(pResult.hasOwnProperty("runDate"), true);
  strictEqual(pResult.hasOwnProperty("violations"), true);
}

describe("[U] report/error-html/utl", () => {
  it("getFormattedAllowedRule - no allowed rule available returns empty array", () => {
    deepStrictEqual(utl.getFormattedAllowedRule({}), []);
  });

  it("getFormattedAllowedRule - empty allowed array returns empty array", () => {
    deepStrictEqual(utl.getFormattedAllowedRule({ allowed: [] }), []);
  });

  it("getFormattedAllowedRule - one rule with no comment, no severity returns default comment & severity", () => {
    deepStrictEqual(
      utl.getFormattedAllowedRule({
        allowed: [{ from: {}, to: {} }],
      }),
      {
        name: "not-in-allowed",
        severity: "warn",
        comment: "-",
      }
    );
  });

  it("getFormattedAllowedRule - a rule with a comment, no severity returns that comment & default severity", () => {
    deepStrictEqual(
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
      }),
      {
        name: "not-in-allowed",
        severity: "warn",
        comment: "this is a comment",
      }
    );
  });

  it("getFormattedAllowedRule - a rule with a severity, no comment returns a default comment & that severity", () => {
    deepStrictEqual(
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
      }),
      {
        name: "not-in-allowed",
        severity: "info",
        comment: "-",
      }
    );
  });

  it("mergeCountIntoRule - no violation", () => {
    deepStrictEqual(utl.mergeCountsIntoRule({ name: "blah" }, {}), {
      name: "blah",
      count: 0,
      ignoredCount: 0,
      unviolated: true,
    });
  });

  it("mergeCountIntoRule - some violations", () => {
    deepStrictEqual(
      utl.mergeCountsIntoRule(
        { name: "blah" },
        { blah: { count: 69, ignoredCount: 0 } }
      ),
      {
        name: "blah",
        count: 69,
        ignoredCount: 0,
        unviolated: false,
      }
    );
  });

  it("formatSummaryForReport - empty", () => {
    const lResult = utl.formatSummaryForReport({});

    summaryHasMinimalAttributes(lResult);
    deepStrictEqual(lResult.violations, []);
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
    deepStrictEqual(lResult.violations, [
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
    deepStrictEqual(lResult.violations, [
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

    deepStrictEqual(utl.determineTo(lInputViolation), lExpectation);
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

    deepStrictEqual(utl.determineTo(lInputViolation), lExpectation);
  });

  it("determineTo - dependency violation", () => {
    const lInputViolation = {
      type: "dependency",
      from: "a",
      to: "thing/a",
    };

    const lExpectation = "thing/a";

    deepStrictEqual(utl.determineTo(lInputViolation), lExpectation);
  });

  it("determineTo - module violation", () => {
    const lInputViolation = {
      type: "module",
      from: "a",
      to: "a",
    };

    const lExpectation = "";

    deepStrictEqual(utl.determineTo(lInputViolation), lExpectation);
  });

  it("determineTo - instability violation", () => {
    const lInputViolation = {
      type: "instability",
      from: "a",
      to: "b",
      metrics: { from: { instability: 0.1 }, to: { instability: 1 } },
    };

    const lExpectation = 'b&nbsp;<span class="extra">(I: 100%)</span>';

    deepStrictEqual(utl.determineTo(lInputViolation), lExpectation);
  });

  it("determineFromExtras - instability violation", () => {
    const lInputViolation = {
      type: "instability",
      from: "a",
      to: "b",
      metrics: { from: { instability: 0.1 }, to: { instability: 1 } },
    };

    const lExpectation = '&nbsp;<span class="extra">(I: 10%)</span>';

    deepStrictEqual(utl.determineFromExtras(lInputViolation), lExpectation);
  });
});
