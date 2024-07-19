import { deepEqual } from "node:assert/strict";
import isSameViolation from "#enrich/summarize/is-same-violation.mjs";

describe("[U] enrich/is-same-violation", () => {
  it("1:1 the same => same", () => {
    const lViolation = {
      rule: {
        severity: "error",
        name: "some-violation",
      },
      from: "somewhere.js",
      to: "somewhere-else.js",
    };
    deepEqual(isSameViolation(lViolation, lViolation), true);
  });
  it("different rule name => not same", () => {
    const lLeftViolation = {
      rule: {
        severity: "error",
        name: "some-violation",
      },
      from: "somewhere.js",
      to: "somewhere-else.js",
    };
    const lRightViolation = {
      rule: {
        severity: "error",
        name: "some-other-violation",
      },
      from: "somewhere.js",
      to: "somewhere-else.js",
    };
    deepEqual(isSameViolation(lLeftViolation, lRightViolation), false);
  });

  it("different from => not same", () => {
    const lLeftViolation = {
      rule: {
        severity: "error",
        name: "some-violation",
      },
      from: "somewhere.js",
      to: "somewhere-else.js",
    };
    const lRightViolation = {
      rule: {
        severity: "error",
        name: "some-violation",
      },
      from: "not-somewhere.js",
      to: "somewhere-else.js",
    };
    deepEqual(isSameViolation(lLeftViolation, lRightViolation), false);
  });

  it("different to => not same", () => {
    const lLeftViolation = {
      rule: {
        severity: "error",
        name: "some-violation",
      },
      from: "somewhere.js",
      to: "somewhere-else.js",
    };
    const lRightViolation = {
      rule: {
        severity: "error",
        name: "some-violation",
      },
      from: "somewhere.js",
      to: "somewhere-else-altogether.js",
    };
    deepEqual(isSameViolation(lLeftViolation, lRightViolation), false);
  });

  it("same cycle => same", () => {
    const lViolation = {
      rule: {
        severity: "error",
        name: "some-violation",
      },
      from: "somewhere.js",
      to: "somewhere-else.js",
      cycle: [
        {
          name: "somewhere.js",
          dependencyTypes: ["local"],
        },
        {
          name: "somewhere-else.js",
          dependencyTypes: ["require"],
        },
      ],
    };
    deepEqual(isSameViolation(lViolation, lViolation), true);
  });

  it("different cycle length => not same", () => {
    const lLeftViolation = {
      rule: {
        severity: "error",
        name: "some-violation",
      },
      from: "somewhere.js",
      to: "somewhere-else.js",
      cycle: [
        {
          name: "somewhere.js",
          dependencyTypes: ["local"],
        },
        {
          name: "somewhere-else.js",
          dependencyTypes: ["require"],
        },
      ],
    };
    const lRightViolation = {
      rule: {
        severity: "error",
        name: "some-violation",
      },
      from: "somewhere.js",
      to: "somewhere-else.js",
      cycle: [
        {
          name: "somewhere.js",
          dependencyTypes: ["local"],
        },
      ],
    };
    deepEqual(isSameViolation(lLeftViolation, lRightViolation), false);
  });

  it("different cycle module => not same", () => {
    const lLeftViolation = {
      rule: {
        severity: "error",
        name: "some-violation",
      },
      from: "somewhere.js",
      to: "somewhere-else.js",
      cycle: [
        {
          name: "somewhere.js",
          dependencyTypes: ["local"],
        },
        {
          name: "somewhere-else.js",
          dependencyTypes: ["require"],
        },
      ],
    };
    const lRightViolation = {
      rule: {
        severity: "error",
        name: "some-violation",
      },
      from: "somewhere.js",
      to: "somewhere-else.js",
      cycle: [
        {
          name: "somewhere.js",
          dependencyTypes: ["local"],
        },
        {
          name: "somewhere-else-altogether.js",
          dependencyTypes: ["require"],
        },
      ],
    };
    deepEqual(isSameViolation(lLeftViolation, lRightViolation), false);
  });
});
