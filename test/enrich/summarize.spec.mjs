import { expect } from "chai";
import summarize from "../../src/enrich/summarize/index.js";
import cycleStartsOnOne from "./mocks/cycle-starts-on-one.mjs";
import cycleStartsOnTwo from "./mocks/cycle-starts-on-two.mjs";
import cycleFest from "./mocks/cycle-fest.mjs";

describe("enrich/summarize", () => {
  it("doesn't add a rule set when there isn't one", () => {
    expect(summarize([], {}, [])).to.deep.equal({
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
  it("adds a rule set when there is one", () => {
    expect(summarize([], { ruleSet: { required: [] } }, [])).to.deep.equal({
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
          from: "src/brand.js",
          to: "src/domain.js",
          rule: {
            severity: "warn",
            name: "no-circular",
          },
          cycle: ["src/domain.js", "src/market.js", "src/brand.js"],
        },
        {
          from: "src/brand.js",
          to: "src/market.js",
          rule: {
            severity: "warn",
            name: "no-circular",
          },
          cycle: ["src/market.js", "src/brand.js"],
        },
        {
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
    const lResult = summarize(cycleFest, lOptions, ["src"]);
    expect(lResult).to.deep.equal(lExpected);
  });
});
