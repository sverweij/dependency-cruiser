import { expect } from "chai";
import summarize from "../../src/enrich/summarize/index.js";

describe("enrich/summarize", () => {
  it("doesn't add a rule set when there isn't one", () => {
    expect(summarize([], {}, [])).to.deep.equal({
      error: 0,
      info: 0,
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
});
