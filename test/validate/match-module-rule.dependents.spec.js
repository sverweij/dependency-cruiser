const { expect } = require("chai");
const {
  matchesDependentsRule,
} = require("../../src/validate/match-module-rule");

const EMPTY_RULE = { from: {}, module: {} };
const ANY_DEPENDENTS = {
  from: {},
  module: { numberOfDependentsLessThan: 100 },
};
const MUST_BE_SHARED_DONT_CARE_FROM_WHERE = {
  from: {},
  module: {
    path: "^src/utensils",
    numberOfDependentsLessThan: 2,
  },
};
const MUST_BE_SHARED_FROM_SNACKBAR = {
  from: {
    path: "^src/snackbar",
  },
  module: {
    path: "^src/utensils",
    numberOfDependentsLessThan: 2,
  },
};
const MUST_BE_SHARED_BUT_NOT_FROM_SNACKBAR = {
  from: {
    pathNot: "^src/snackbar",
  },
  module: {
    path: "^src/utensils",
    numberOfDependentsLessThan: 2,
  },
};
describe("validate/match-module-rule - dependents", () => {
  it("rule without dependents restriction doesn't flag (implicit)", () => {
    expect(matchesDependentsRule(EMPTY_RULE, {})).to.equal(false);
  });
  it("rule without dependents restriction doesn't flag (explicit)", () => {
    expect(matchesDependentsRule(EMPTY_RULE, { dependents: [] })).to.equal(
      false
    );
  });
  it("rule with dependents doesn't match a module with no dependents attribute", () => {
    expect(matchesDependentsRule(ANY_DEPENDENTS, {})).to.equal(false);
  });
  it("rule that matches any dependents does match a module with a dependents attribute", () => {
    expect(matchesDependentsRule(ANY_DEPENDENTS, { dependents: [] })).to.equal(
      true
    );
  });
  it("rule that matches any dependents does match a module with a dependents attribute (>1 dependent)", () => {
    expect(
      matchesDependentsRule(ANY_DEPENDENTS, {
        dependents: ["aap", "noot", "mies", "wim"],
      })
    ).to.equal(true);
  });

  it("must-share (>=2 dependents) rule doesn't flag when there's 2 dependents", () => {
    expect(
      matchesDependentsRule(MUST_BE_SHARED_DONT_CARE_FROM_WHERE, {
        source: "src/utensils/simsalabim.ts",
        dependents: ["aap", "noot"],
      })
    ).to.equal(false);
  });

  it("must-share (>=2 dependents) rule flags when there's 1 dependent", () => {
    expect(
      matchesDependentsRule(MUST_BE_SHARED_DONT_CARE_FROM_WHERE, {
        source: "src/utensils/simsalabim.ts",
        dependents: ["aap"],
      })
    ).to.equal(true);
  });

  it("must-share (>=2 dependents) rule flags when there's 0 dependents", () => {
    expect(
      matchesDependentsRule(MUST_BE_SHARED_DONT_CARE_FROM_WHERE, {
        source: "src/utensils/simsalabim.ts",
        dependents: [],
      })
    ).to.equal(true);
  });

  it("must-share (>=2 dependents) with a from doesn't flag when there's 2 dependents from that from", () => {
    expect(
      matchesDependentsRule(MUST_BE_SHARED_FROM_SNACKBAR, {
        source: "src/utensils/frieten.ts",
        dependents: ["src/snackbar/kapsalon.ts", "src/snackbar/zijspan.ts"],
      })
    ).to.equal(false);
  });

  it("must-share (>=2 dependents) with a from doesn't flag when there's 2 dependents from that from (+ some others that don't matter)", () => {
    expect(
      matchesDependentsRule(MUST_BE_SHARED_FROM_SNACKBAR, {
        source: "src/utensils/frieten.ts",
        dependents: [
          "src/snackbar/kapsalon.ts",
          "src/snackbar/zijspan.ts",
          "src/fietsenwinkel/index.ts",
          "src/fietsenwinkel/index.ts",
        ],
      })
    ).to.equal(false);
  });

  it("must-share (>=2 dependents) with a from path when there's only 1 dependents from that from path", () => {
    expect(
      matchesDependentsRule(MUST_BE_SHARED_FROM_SNACKBAR, {
        source: "src/utensils/frieten.ts",
        dependents: [
          "src/snackbar/kapsalon.ts",
          "src/fietsenwinkel/zijspan.ts",
        ],
      })
    ).to.equal(true);
  });

  it("must-share (>=2 dependents) with a from pathNot when there's only 1 dependents from that from pathNot", () => {
    expect(
      matchesDependentsRule(MUST_BE_SHARED_BUT_NOT_FROM_SNACKBAR, {
        source: "src/utensils/frieten.ts",
        dependents: [
          "src/snackbar/kapsalon.ts",
          "src/fietsenwinkel/zijspan.ts",
        ],
      })
    ).to.equal(true);
  });
  it("must-share (>=2 dependents) with a from pathNot when there's 0 dependents from that from pathNot", () => {
    expect(
      matchesDependentsRule(MUST_BE_SHARED_BUT_NOT_FROM_SNACKBAR, {
        source: "src/utensils/frieten.ts",
        dependents: ["src/snackbar/kapsalon.ts", "src/snackbar/zijspan.ts"],
      })
    ).to.equal(false);
  });
});
