import { expect } from "chai";
import summarize from "../../src/enrich/summarize/index.js";
import cycleStartsOnOne from "./mocks/cycle-starts-on-one.mjs";
import cycleStartsOnTwo from "./mocks/cycle-starts-on-two.mjs";

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
            severity: "error",
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
});
