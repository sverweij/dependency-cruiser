import { equal } from "node:assert/strict";
import { compareViolations } from "#graph-utl/compare.mjs";

describe("[U] graph-utl/compare - violations", () => {
  const lViolation = {
    from: "from",
    to: "to",
    rule: {
      name: "cool-rule",
      severity: "error",
    },
  };

  const lLessSevereViolation = {
    from: "from",
    to: "to",
    rule: {
      name: "cool-rule",
      severity: "info",
    },
  };

  const lLaterNameViolation = {
    from: "from",
    to: "to",
    rule: {
      name: "drool-rule",
      severity: "error",
    },
  };

  const lLaterToViolation = {
    from: "from",
    to: "tox",
    rule: {
      name: "cool-rule",
      severity: "error",
    },
  };

  const lLaterFromViolation = {
    from: "fromx",
    to: "to",
    rule: {
      name: "cool-rule",
      severity: "error",
    },
  };

  it("returns 0 for identical violations", () => {
    equal(compareViolations(lViolation, lViolation), 0);
  });

  it("returns -1 when severity > the one compared against", () => {
    equal(compareViolations(lViolation, lLessSevereViolation), -1);
  });

  it("returns 1 when severity < the one compared against", () => {
    equal(compareViolations(lLessSevereViolation, lViolation), 1);
  });

  it("returns -1 when rule name < the one compared against", () => {
    equal(compareViolations(lViolation, lLaterNameViolation), -1);
  });

  it("returns -1 when rule 'from' < the one compared against", () => {
    equal(compareViolations(lViolation, lLaterFromViolation), -1);
  });

  it("returns -1 when rule 'to' < the one compared against", () => {
    equal(compareViolations(lViolation, lLaterToViolation), -1);
  });
});
