import { strictEqual } from "node:assert";
import { describe, it } from "node:test";
import { violations } from "../../src/graph-utl/compare.mjs";

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
    strictEqual(violations(lViolation, lViolation), 0);
  });

  it("returns -1 when severity > the one compared against", () => {
    strictEqual(violations(lViolation, lLessSevereViolation), -1);
  });

  it("returns 1 when severity < the one compared against", () => {
    strictEqual(violations(lLessSevereViolation, lViolation), 1);
  });

  it("returns -1 when rule name < the one compared against", () => {
    strictEqual(violations(lViolation, lLaterNameViolation), -1);
  });

  it("returns -1 when rule 'from' < the one compared against", () => {
    strictEqual(violations(lViolation, lLaterFromViolation), -1);
  });

  it("returns -1 when rule 'to' < the one compared against", () => {
    strictEqual(violations(lViolation, lLaterToViolation), -1);
  });
});
