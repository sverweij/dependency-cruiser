import { deepEqual } from "node:assert/strict";
import { getBaselineDiffCounts } from "#analyze/summarize/get-stats.mjs";

describe("[U] analyze/summarize/getBaselineDiffCounts", () => {
  it("counts baseline, matching, and stale violations", () => {
    const lSharedViolation = {
      from: "src/shared.js",
      to: "src/shared.js",
      rule: {
        name: "shared-rule",
        severity: "error",
      },
    };
    const lStaleViolation = {
      from: "src/stale.js",
      to: "src/stale.js",
      rule: {
        name: "stale-rule",
        severity: "warn",
      },
    };
    const lNewViolation = {
      from: "src/new.js",
      to: "src/new.js",
      rule: {
        name: "new-rule",
        severity: "info",
      },
    };

    deepEqual(
      getBaselineDiffCounts(
        [lSharedViolation, lStaleViolation],
        [lSharedViolation, lNewViolation],
      ),
      {
        baselineSize: 2,
        baselineMatched: 1,
        baselineStale: 1,
      },
    );
  });
});
