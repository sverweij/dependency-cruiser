import { expect } from "chai";
import uniqWith from "lodash/uniqWith.js";
import isSameViolation from "../../src/enrich/summarize/is-same-violation.mjs";

const deDuplicateViolations = (pViolations) =>
  uniqWith(pViolations, isSameViolation);
describe("[U] enrich/de-duplicate-violations", () => {
  it("no violations => no violations", () => {
    expect(deDuplicateViolations([])).to.deep.equal([]);
  });
  it("non-cyclic violations => same non-cyclic violations", () => {
    const lViolations = [
      {
        from: "somewhere.js",
        to: "somewhere-else.js",
        rule: {
          severity: "error",
          name: "no-thi-ng-else",
        },
      },
      {
        from: "call.js",
        to: "kthulu.js",
        rule: {
          severity: "warn",
          name: "matters",
        },
      },
    ];
    expect(deDuplicateViolations(lViolations)).to.deep.equal(lViolations);
  });

  it("2 violations from different cycles => the 2 same violations", () => {
    const lViolations = [
      {
        from: "src/report/not/index.js",
        to: "src/report/not/module-utl.js",
        rule: {
          severity: "error",
          name: "no-circular",
        },
        cycle: ["src/report/not/module-utl.js", "src/report/not/index.js"],
      },
      {
        from: "src/report/dot/module-utl.js",
        to: "src/report/dot/index.js",
        rule: {
          severity: "error",
          name: "no-circular",
        },
        cycle: ["src/report/dot/index.js", "src/report/dot/module-utl.js"],
      },
    ];
    expect(deDuplicateViolations(lViolations)).to.deep.equal(lViolations);
  });

  it("2 violations from the same cycle => 1 violation", () => {
    const lViolations = [
      {
        from: "src/report/dot/index.js",
        to: "src/report/dot/module-utl.js",
        rule: {
          severity: "error",
          name: "no-circular",
        },
        cycle: ["src/report/dot/module-utl.js", "src/report/dot/index.js"],
      },
      {
        from: "src/report/dot/module-utl.js",
        to: "src/report/dot/index.js",
        rule: {
          severity: "error",
          name: "no-circular",
        },
        cycle: ["src/report/dot/index.js", "src/report/dot/module-utl.js"],
      },
    ];
    const lDeDuplicatedViolations = [
      {
        from: "src/report/dot/index.js",
        to: "src/report/dot/module-utl.js",
        rule: {
          severity: "error",
          name: "no-circular",
        },
        cycle: ["src/report/dot/module-utl.js", "src/report/dot/index.js"],
      },
    ];
    expect(deDuplicateViolations(lViolations)).to.deep.equal(
      lDeDuplicatedViolations
    );
  });

  it("2 violations from the same cycle, but of different name => no changes", () => {
    const lViolations = [
      {
        from: "src/report/dot/index.js",
        to: "src/report/dot/module-utl.js",
        rule: {
          severity: "error",
          name: "no-ride-the-lightning",
        },
        cycle: ["src/report/dot/module-utl.js", "src/report/dot/index.js"],
      },
      {
        from: "src/report/dot/module-utl.js",
        to: "src/report/dot/index.js",
        rule: {
          severity: "error",
          name: "no-circular",
        },
        cycle: ["src/report/dot/index.js", "src/report/dot/module-utl.js"],
      },
    ];
    expect(deDuplicateViolations(lViolations)).to.deep.equal(lViolations);
  });

  it("does not mix up cyclic & non-cyclic violations when de-duplicating", () => {
    const lViolations = [
      {
        from: "src/report/dot/index.js",
        to: "src/report/dot/module-utl.js",
        rule: {
          severity: "error",
          name: "no-fade-to-black",
        },
      },
      {
        from: "src/report/dot/index.js",
        to: "src/report/dot/module-utl.js",
        rule: {
          severity: "error",
          name: "no-circular",
        },
        cycle: ["src/report/dot/module-utl.js", "src/report/dot/index.js"],
      },
      {
        from: "src/report/dot/module-utl.js",
        to: "src/report/dot/index.js",
        rule: {
          severity: "error",
          name: "no-circular",
        },
        cycle: ["src/report/dot/index.js", "src/report/dot/module-utl.js"],
      },
    ];
    const lDeDuplicatedViolations = [
      {
        from: "src/report/dot/index.js",
        to: "src/report/dot/module-utl.js",
        rule: {
          severity: "error",
          name: "no-fade-to-black",
        },
      },
      {
        from: "src/report/dot/index.js",
        to: "src/report/dot/module-utl.js",
        rule: {
          severity: "error",
          name: "no-circular",
        },
        cycle: ["src/report/dot/module-utl.js", "src/report/dot/index.js"],
      },
    ];
    expect(deDuplicateViolations(lViolations)).to.deep.equal(
      lDeDuplicatedViolations
    );
  });
});
