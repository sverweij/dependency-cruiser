import { expect, use } from "chai";
import chaiJSONSchema from "chai-json-schema";
import summarize from "../../src/enrich/summarize/index.mjs";
import cruiseResultSchema from "../../src/schema/cruise-result.schema.mjs";
import cycleStartsOnOne from "./__mocks__/cycle-starts-on-one.mjs";
import cycleStartsOnTwo from "./__mocks__/cycle-starts-on-two.mjs";
import cycleFest from "./__mocks__/cycle-fest.mjs";

use(chaiJSONSchema);

describe("[I] enrich/summarize", () => {
  it("doesn't add a rule set when there isn't one", () => {
    const lSummary = summarize([], {}, []);
    expect(lSummary).to.deep.equal({
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
    expect({ modules: [], summary: lSummary }).to.be.jsonSchema(
      cruiseResultSchema
    );
  });
  it("adds a rule set when there is one", () => {
    const lSummary = summarize([], { ruleSet: { required: [] } }, []);
    expect(lSummary).to.deep.equal({
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
    expect({ modules: [], summary: lSummary }).to.be.jsonSchema(
      cruiseResultSchema
    );
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

    expect(lResult1).to.deep.equal(lResult2);
    expect({ modules: [], summary: lResult1 }).to.be.jsonSchema(
      cruiseResultSchema
    );
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
          cycle: ["src/domain.js", "src/market.js", "src/brand.js"],
        },
        {
          type: "cycle",
          from: "src/brand.js",
          to: "src/market.js",
          rule: {
            severity: "warn",
            name: "no-circular",
          },
          cycle: ["src/market.js", "src/brand.js"],
        },
        {
          type: "cycle",
          from: "src/domain.js",
          to: "src/market.js",
          rule: {
            severity: "warn",
            name: "no-circular",
          },
          cycle: ["src/market.js", "src/domain.js"],
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
    expect(lSummary).to.deep.equal(lExpected);
    expect({ modules: [], summary: lSummary }).to.be.jsonSchema(
      cruiseResultSchema
    );
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
    expect(
      summarize([], { knownViolations: lKnownViolations }, [])
    ).to.deep.equal({
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
    expect(summarize([], { knownViolations: [] }, [])).to.deep.equal({
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
      []
    );

    expect(lSummary).to.deep.equal({
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
    expect({ modules: [], summary: lSummary }).to.be.jsonSchema(
      cruiseResultSchema
    );
  });
});
