import { deepEqual, equal } from "node:assert/strict";
import { compareViolations, diffViolationArrays } from "#graph-utl/compare.mjs";

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

  it("returns -1 when cycle is alphabetically earlier", () => {
    const lCycleA = {
      from: "a",
      to: "b",
      rule: { name: "no-cycles", severity: "error" },
      cycle: [
        { name: "a", dependencyTypes: ["local"] },
        { name: "b", dependencyTypes: ["local"] },
      ],
    };
    const lCycleB = {
      from: "a",
      to: "b",
      rule: { name: "no-cycles", severity: "error" },
      cycle: [
        { name: "c", dependencyTypes: ["local"] },
        { name: "b", dependencyTypes: ["local"] },
      ],
    };
    equal(compareViolations(lCycleA, lCycleB), -1);
  });

  it("returns 1 when cycle is alphabetically later", () => {
    const lCycleA = {
      from: "a",
      to: "b",
      rule: { name: "no-cycles", severity: "error" },
      cycle: [
        { name: "c", dependencyTypes: ["local"] },
        { name: "b", dependencyTypes: ["local"] },
      ],
    };
    const lCycleB = {
      from: "a",
      to: "b",
      rule: { name: "no-cycles", severity: "error" },
      cycle: [
        { name: "a", dependencyTypes: ["local"] },
        { name: "b", dependencyTypes: ["local"] },
      ],
    };
    equal(compareViolations(lCycleA, lCycleB), 1);
  });

  it("returns -1 when first cycle is shorter", () => {
    const lCycleA = {
      from: "a",
      to: "b",
      rule: { name: "no-cycles", severity: "error" },
      cycle: [{ name: "a", dependencyTypes: ["local"] }],
    };
    const lCycleB = {
      from: "a",
      to: "b",
      rule: { name: "no-cycles", severity: "error" },
      cycle: [
        { name: "a", dependencyTypes: ["local"] },
        { name: "b", dependencyTypes: ["local"] },
      ],
    };
    equal(compareViolations(lCycleA, lCycleB), -1);
  });

  it("returns -1 when via is alphabetically earlier", () => {
    const lViaA = {
      from: "a",
      to: "d",
      rule: { name: "reachability", severity: "error" },
      via: [
        { name: "b", dependencyTypes: ["local"] },
        { name: "c", dependencyTypes: ["local"] },
      ],
    };
    const lViaB = {
      from: "a",
      to: "d",
      rule: { name: "reachability", severity: "error" },
      via: [
        { name: "x", dependencyTypes: ["local"] },
        { name: "c", dependencyTypes: ["local"] },
      ],
    };
    equal(compareViolations(lViaA, lViaB), -1);
  });

  it("returns 0 when both violations lack cycle or via fields", () => {
    equal(compareViolations(lViolation, lViolation), 0);
  });

  it("returns -1 when first violation has no cycle and second does", () => {
    const lNoCycle = {
      from: "a",
      to: "b",
      rule: { name: "no-cycles", severity: "error" },
    };
    const lWithCycle = {
      from: "a",
      to: "b",
      rule: { name: "no-cycles", severity: "error" },
      cycle: [{ name: "a", dependencyTypes: ["local"] }],
    };
    equal(compareViolations(lNoCycle, lWithCycle), -1);
  });

  it("returns -1 when unresolvedTo is alphabetically earlier", () => {
    const lUnresA = {
      from: "from",
      to: "to",
      rule: { name: "cool-rule", severity: "error" },
      unresolvedTo: "a",
    };
    const lUnresB = {
      from: "from",
      to: "to",
      rule: { name: "cool-rule", severity: "error" },
      unresolvedTo: "z",
    };
    equal(compareViolations(lUnresA, lUnresB), -1);
  });

  it("returns -1 when type is alphabetically earlier", () => {
    const lTypeA = {
      from: "from",
      to: "to",
      rule: { name: "cool-rule", severity: "error" },
      type: "a",
    };
    const lTypeB = {
      from: "from",
      to: "to",
      rule: { name: "cool-rule", severity: "error" },
      type: "z",
    };
    equal(compareViolations(lTypeA, lTypeB), -1);
  });

  it("returns -1 when dependencyTypes is alphabetically earlier", () => {
    const lDepTypesA = {
      from: "from",
      to: "to",
      rule: { name: "cool-rule", severity: "error" },
      dependencyTypes: ["alpha", "beta"],
    };
    const lDepTypesB = {
      from: "from",
      to: "to",
      rule: { name: "cool-rule", severity: "error" },
      dependencyTypes: ["alpha", "kappa"],
    };
    equal(compareViolations(lDepTypesA, lDepTypesB), -1);
  });

  it("diffs arrays of violations by value", () => {
    const lSharedViolation = {
      from: "app.js",
      to: "lib.js",
      rule: { name: "no-cycles", severity: "error" },
    };
    const lOldViolation = {
      from: "a.js",
      to: "b.js",
      rule: { name: "no-cycles", severity: "warn" },
    };
    const lNewViolation = {
      from: "c.js",
      to: "d.js",
      rule: { name: "no-cycles", severity: "info" },
    };

    deepEqual(
      diffViolationArrays(
        [lOldViolation, lSharedViolation],
        [lSharedViolation, lNewViolation],
      ),
      {
        new: [lNewViolation],
        same: [lSharedViolation],
        old: [lOldViolation],
      },
    );
  });

  it("diffs arrays with repeated equal violations without inventing new comparison logic", () => {
    const lDuplicateViolation = {
      from: "dup.js",
      to: "dup-target.js",
      rule: { name: "reachability", severity: "error" },
    };
    const lOtherViolation = {
      from: "other.js",
      to: "other-target.js",
      rule: { name: "reachability", severity: "warn" },
    };

    deepEqual(
      diffViolationArrays(
        [lDuplicateViolation, lDuplicateViolation, lOtherViolation],
        [lDuplicateViolation],
      ),
      {
        new: [],
        same: [lDuplicateViolation],
        old: [lDuplicateViolation, lOtherViolation],
      },
    );
  });

  it("uses cycle and via details and tolerates missing optional fields", () => {
    const lSameViaViolation = {
      from: "src/a.js",
      to: "src/z.js",
      rule: { name: "reachability", severity: "error" },
      via: [{ name: "src/b.js" }, { name: "src/c.js" }],
    };
    const lDifferentViaViolation = {
      from: "src/a.js",
      to: "src/z.js",
      rule: { name: "reachability", severity: "error" },
      via: [{ name: "src/x.js" }, { name: "src/c.js" }],
    };
    const lSameCycleViolation = {
      from: "src/a.js",
      to: "src/b.js",
      rule: { name: "no-cycles", severity: "error" },
      cycle: [{ name: "src/a.js" }, { name: "src/b.js" }],
    };
    const lDifferentCycleViolation = {
      from: "src/a.js",
      to: "src/b.js",
      rule: { name: "no-cycles", severity: "error" },
      cycle: [{ name: "src/a.js" }, { name: "src/c.js" }],
    };

    deepEqual(diffViolationArrays([lSameViaViolation], [lSameViaViolation]), {
      new: [],
      same: [lSameViaViolation],
      old: [],
    });
    deepEqual(
      diffViolationArrays([lSameCycleViolation], [lDifferentCycleViolation]),
      {
        new: [lDifferentCycleViolation],
        same: [],
        old: [lSameCycleViolation],
      },
    );
    deepEqual(
      diffViolationArrays([lDifferentViaViolation], [lSameViaViolation]),
      {
        new: [lSameViaViolation],
        same: [],
        old: [lDifferentViaViolation],
      },
    );
  });
});
