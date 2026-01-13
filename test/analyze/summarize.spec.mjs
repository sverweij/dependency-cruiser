import { deepEqual } from "node:assert/strict";
import cycleStartsOnOne from "./__mocks__/cycle-starts-on-one.mjs";
import cycleStartsOnTwo from "./__mocks__/cycle-starts-on-two.mjs";
import cycleFest from "./__mocks__/cycle-fest.mjs";
import { validate as validateCruiseResult } from "#schema/cruise-result.validate.mjs";
import summarize from "#analyze/summarize/index.mjs";

describe("[I] analyze/summarize", () => {
  it("doesn't add a rule set when there isn't one", () => {
    const lSummary = summarize([], {}, []);
    deepEqual(lSummary, {
      error: 0,
      info: 0,
      ignore: 0,
      optionsUsed: {
        args: "",
      },
      totalCruised: 0,
      totalDependenciesCruised: 0,
      violations: [],
      warn: 0,
    });
    validateCruiseResult({ modules: [], summary: lSummary });
  });
  it("adds a rule set when there is one", () => {
    const lSummary = summarize([], { ruleSet: { required: [] } }, []);
    deepEqual(lSummary, {
      error: 0,
      info: 0,
      ignore: 0,
      optionsUsed: {
        args: "",
      },
      ruleSetUsed: {
        required: [],
      },
      totalCruised: 0,
      totalDependenciesCruised: 0,
      violations: [],
      warn: 0,
    });
    validateCruiseResult({ modules: [], summary: lSummary });
  });

  it("consistently summarizes the same circular dependency, regardless the order", () => {
    const lOptions = {
      ruleSet: {
        forbidden: [
          {
            name: "no-circular",
            severity: "warn",
            from: {},
            to: {
              circular: true,
            },
          },
        ],
      },
    };
    const lResult1 = summarize(cycleStartsOnOne, lOptions, ["src"]);
    const lResult2 = summarize(cycleStartsOnTwo, lOptions, ["src"]);

    deepEqual(lResult1, lResult2);
    validateCruiseResult({ modules: [], summary: lResult1 });
  });

  it("summarizes all circular dependencies, even when there's more per thingus", () => {
    const lOptions = {
      ruleSet: {
        forbidden: [
          {
            name: "no-circular",
            severity: "warn",
            from: {},
            to: {
              circular: true,
            },
          },
        ],
      },
    };
    const lExpected = {
      violations: [
        {
          type: "cycle",
          from: "src/brand.js",
          to: "src/domain.js",
          rule: {
            severity: "warn",
            name: "no-circular",
          },
          cycle: [
            {
              name: "src/domain.js",
              dependencyTypes: ["local"],
            },
            {
              name: "src/market.js",
              dependencyTypes: ["local"],
            },
            {
              name: "src/brand.js",
              dependencyTypes: ["local"],
            },
          ],
        },
        {
          type: "cycle",
          from: "src/brand.js",
          to: "src/market.js",
          rule: {
            severity: "warn",
            name: "no-circular",
          },
          cycle: [
            {
              name: "src/market.js",
              dependencyTypes: ["local"],
            },
            {
              name: "src/brand.js",
              dependencyTypes: ["local"],
            },
          ],
        },
        {
          type: "cycle",
          from: "src/domain.js",
          to: "src/market.js",
          rule: {
            severity: "warn",
            name: "no-circular",
          },
          cycle: [
            {
              name: "src/market.js",
              dependencyTypes: ["local"],
            },
            {
              name: "src/domain.js",
              dependencyTypes: ["local"],
            },
          ],
        },
      ],
      error: 0,
      warn: 3,
      info: 0,
      ignore: 0,
      totalCruised: 3,
      totalDependenciesCruised: 5,
      optionsUsed: {
        args: "src",
      },
      ruleSetUsed: {
        forbidden: [
          {
            name: "no-circular",
            severity: "warn",
            from: {},
            to: {
              circular: true,
            },
          },
        ],
      },
    };

    const lSummary = summarize(cycleFest, lOptions, ["src"]);
    deepEqual(lSummary, lExpected);
    validateCruiseResult({ modules: [], summary: lSummary });
  });

  it("includes known violations in the summary", () => {
    const lKnownViolations = [
      {
        from: "src/schema/baseline-violations.schema.js",
        to: "src/schema/baseline-violations.schema.js",
        rule: {
          severity: "error",
          name: "not-unreachable-from-cli",
        },
      },
      {
        from: "src/cli/format.js",
        to: "src/cli/format.js",
        rule: {
          severity: "info",
          name: "not-reachable-from-folder-index",
        },
      },
    ];
    deepEqual(summarize([], { knownViolations: lKnownViolations }, []), {
      error: 0,
      info: 0,
      ignore: 0,
      optionsUsed: {
        args: "",
        knownViolations: lKnownViolations,
      },
      totalCruised: 0,
      totalDependenciesCruised: 0,
      violations: [],
      warn: 0,
    });
  });

  it("doesn't include known violations key when none exist", () => {
    deepEqual(summarize([], { knownViolations: [] }, []), {
      error: 0,
      info: 0,
      ignore: 0,
      optionsUsed: {
        args: "",
      },
      totalCruised: 0,
      totalDependenciesCruised: 0,
      violations: [],
      warn: 0,
    });
  });

  it("violating something with moreUnstable & instabilities", () => {
    const lSummary = summarize(
      [
        {
          source: "violation.js",
          instability: 0.42,
          dependencies: [
            {
              resolved: "dont-touch-this.js",
              instability: 1,
              valid: false,
              rules: [
                {
                  name: "a-rule",
                  severity: "warn",
                },
              ],
            },
          ],
        },
      ],
      {
        ruleSet: {
          forbidden: [{ name: "a-rule", from: {}, to: { moreUnstable: true } }],
        },
      },
      [],
    );

    deepEqual(lSummary, {
      violations: [
        {
          type: "instability",
          from: "violation.js",
          to: "dont-touch-this.js",
          rule: {
            name: "a-rule",
            severity: "warn",
          },
          metrics: {
            from: {
              instability: 0.42,
            },
            to: {
              instability: 1,
            },
          },
        },
      ],
      info: 0,
      warn: 1,
      error: 0,
      ignore: 0,
      totalDependenciesCruised: 1,
      totalCruised: 1,
      optionsUsed: {
        args: "",
      },
      ruleSetUsed: {
        forbidden: [
          {
            from: {},
            name: "a-rule",
            to: {
              moreUnstable: true,
            },
          },
        ],
      },
    });
    validateCruiseResult({ modules: [], summary: lSummary });
  });
});
