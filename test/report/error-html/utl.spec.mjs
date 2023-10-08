import { deepEqual, equal } from "node:assert/strict";
import utl from "#report/error-html/utl.mjs";

function summaryHasMinimalAttributes(pResult) {
  equal(pResult.hasOwnProperty("depcruiseVersion"), true);
  equal(pResult.hasOwnProperty("runDate"), true);
  equal(pResult.hasOwnProperty("violations"), true);
}

describe("[U] report/error-html/utl", () => {
  it("getFormattedAllowedRule - no allowed rule available returns empty array", () => {
    deepEqual(utl.getFormattedAllowedRule({}), []);
  });

  it("getFormattedAllowedRule - empty allowed array returns empty array", () => {
    deepEqual(utl.getFormattedAllowedRule({ allowed: [] }), []);
  });

  it("getFormattedAllowedRule - one rule with no comment, no severity returns default comment & severity", () => {
    deepEqual(
      utl.getFormattedAllowedRule({
        allowed: [{ from: {}, to: {} }],
      }),
      {
        name: "not-in-allowed",
        severity: "warn",
        comment: "-",
      },
    );
  });

  it("getFormattedAllowedRule - a rule with a comment, no severity returns that comment & default severity", () => {
    deepEqual(
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
      },
    );
  });

  it("getFormattedAllowedRule - a rule with a severity, no comment returns a default comment & that severity", () => {
    deepEqual(
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
      },
    );
  });

  it("mergeCountIntoRule - no violation", () => {
    deepEqual(utl.mergeCountsIntoRule({ name: "blah" }, {}), {
      name: "blah",
      count: 0,
      ignoredCount: 0,
      unviolated: true,
    });
  });

  it("mergeCountIntoRule - some violations", () => {
    deepEqual(
      utl.mergeCountsIntoRule(
        { name: "blah" },
        { blah: { count: 69, ignoredCount: 0 } },
      ),
      {
        name: "blah",
        count: 69,
        ignoredCount: 0,
        unviolated: false,
      },
    );
  });

  it("formatSummaryForReport - empty", () => {
    const lResult = utl.formatSummaryForReport({});

    summaryHasMinimalAttributes(lResult);
    deepEqual(lResult.violations, []);
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
    deepEqual(lResult.violations, [
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
    deepEqual(lResult.violations, [
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

    deepEqual(utl.determineTo(lInputViolation), lExpectation);
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

    deepEqual(utl.determineTo(lInputViolation), lExpectation);
  });

  it("determineTo - dependency violation", () => {
    const lInputViolation = {
      type: "dependency",
      from: "a",
      to: "thing/a",
    };

    const lExpectation = "thing/a";

    deepEqual(utl.determineTo(lInputViolation), lExpectation);
  });

  it("determineTo - module violation", () => {
    const lInputViolation = {
      type: "module",
      from: "a",
      to: "a",
    };

    const lExpectation = "";

    deepEqual(utl.determineTo(lInputViolation), lExpectation);
  });

  it("determineTo - instability violation", () => {
    const lInputViolation = {
      type: "instability",
      from: "a",
      to: "b",
      metrics: { from: { instability: 0.1 }, to: { instability: 1 } },
    };

    const lExpectation = 'b&nbsp;<span class="extra">(I: 100%)</span>';

    deepEqual(utl.determineTo(lInputViolation), lExpectation);
  });

  it("determineFromExtras - instability violation", () => {
    const lInputViolation = {
      type: "instability",
      from: "a",
      to: "b",
      metrics: { from: { instability: 0.1 }, to: { instability: 1 } },
    };

    const lExpectation = '&nbsp;<span class="extra">(I: 10%)</span>';

    deepEqual(utl.determineFromExtras(lInputViolation), lExpectation);
  });
});
