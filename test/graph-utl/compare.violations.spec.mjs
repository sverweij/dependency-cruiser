import { expect } from "chai";
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
    expect(violations(lViolation, lViolation)).to.equal(0);
  });

  it("returns -1 when severity > the one compared against", () => {
    expect(violations(lViolation, lLessSevereViolation)).to.equal(-1);
  });

  it("returns 1 when severity < the one compared against", () => {
    expect(violations(lLessSevereViolation, lViolation)).to.equal(1);
  });

  it("returns -1 when rule name < the one compared against", () => {
    expect(violations(lViolation, lLaterNameViolation)).to.equal(-1);
  });

  it("returns -1 when rule 'from' < the one compared against", () => {
    expect(violations(lViolation, lLaterFromViolation)).to.equal(-1);
  });

  it("returns -1 when rule 'to' < the one compared against", () => {
    expect(violations(lViolation, lLaterToViolation)).to.equal(-1);
  });
});
