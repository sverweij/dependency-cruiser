import { strictEqual } from "node:assert";
import { describe, it } from "node:test";
import matchModuleRule from "../../src/validate/match-module-rule.mjs";

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

const CANNOT_BE_SHARED_MORE_THAN_THREE_TIMES = {
  from: {
    pathNot: "^src/snackbar",
  },
  module: {
    path: "^src/utensils",
    numberOfDependentsMoreThan: 3,
  },
};

const USED_FROM_SNACKBAR_BETWEEN = {
  from: {
    pathNot: "^src/snackbar",
  },
  module: {
    path: "^src/utensils",
    numberOfDependentsMoreThan: 3,
    numberOfDependentsLessThan: 5,
  },
};

describe("[I] validate/match-module-rule - dependents", () => {
  it("rule without dependents restriction doesn't flag (implicit)", () => {
    strictEqual(matchModuleRule.matchesDependentsRule(EMPTY_RULE, {}), false);
  });
  it("rule without dependents restriction doesn't flag (explicit)", () => {
    strictEqual(
      matchModuleRule.matchesDependentsRule(EMPTY_RULE, { dependents: [] }),
      false
    );
  });
  it("rule with dependents doesn't match a module with no dependents attribute", () => {
    strictEqual(
      matchModuleRule.matchesDependentsRule(ANY_DEPENDENTS, {}),
      false
    );
  });
  it("rule that matches any dependents does match a module with a dependents attribute", () => {
    strictEqual(
      matchModuleRule.matchesDependentsRule(ANY_DEPENDENTS, { dependents: [] }),
      true
    );
  });
  it("rule that matches any dependents does match a module with a dependents attribute (>1 dependent)", () => {
    strictEqual(
      matchModuleRule.matchesDependentsRule(ANY_DEPENDENTS, {
        dependents: ["aap", "noot", "mies", "wim"],
      }),
      true
    );
  });

  it("must-share (>=2 dependents) rule doesn't flag when there's 2 dependents", () => {
    strictEqual(
      matchModuleRule.matchesDependentsRule(
        MUST_BE_SHARED_DONT_CARE_FROM_WHERE,
        {
          source: "src/utensils/simsalabim.ts",
          dependents: ["aap", "noot"],
        }
      ),
      false
    );
  });

  it("must-share (>=2 dependents) rule flags when there's 1 dependent", () => {
    strictEqual(
      matchModuleRule.matchesDependentsRule(
        MUST_BE_SHARED_DONT_CARE_FROM_WHERE,
        {
          source: "src/utensils/simsalabim.ts",
          dependents: ["aap"],
        }
      ),
      true
    );
  });

  it("must-share (>=2 dependents) rule flags when there's 0 dependents", () => {
    strictEqual(
      matchModuleRule.matchesDependentsRule(
        MUST_BE_SHARED_DONT_CARE_FROM_WHERE,
        {
          source: "src/utensils/simsalabim.ts",
          dependents: [],
        }
      ),
      true
    );
  });

  it("must-share (>=2 dependents) with a from doesn't flag when there's 2 dependents from that from", () => {
    strictEqual(
      matchModuleRule.matchesDependentsRule(MUST_BE_SHARED_FROM_SNACKBAR, {
        source: "src/utensils/frieten.ts",
        dependents: ["src/snackbar/kapsalon.ts", "src/snackbar/zijspan.ts"],
      }),
      false
    );
  });

  it("must-share (>=2 dependents) with a from doesn't flag when there's 2 dependents from that from (+ some others that don't matter)", () => {
    strictEqual(
      matchModuleRule.matchesDependentsRule(MUST_BE_SHARED_FROM_SNACKBAR, {
        source: "src/utensils/frieten.ts",
        dependents: [
          "src/snackbar/kapsalon.ts",
          "src/snackbar/zijspan.ts",
          "src/fietsenwinkel/index.ts",
          "src/fietsenwinkel/index.ts",
        ],
      }),
      false
    );
  });

  it("must-share (>=2 dependents) with a from path when there's only 1 dependents from that from path", () => {
    strictEqual(
      matchModuleRule.matchesDependentsRule(MUST_BE_SHARED_FROM_SNACKBAR, {
        source: "src/utensils/frieten.ts",
        dependents: [
          "src/snackbar/kapsalon.ts",
          "src/fietsenwinkel/zijspan.ts",
        ],
      }),
      true
    );
  });

  it("must-share (>=2 dependents) with a from pathNot when there's only 1 dependents from that from pathNot", () => {
    strictEqual(
      matchModuleRule.matchesDependentsRule(
        MUST_BE_SHARED_BUT_NOT_FROM_SNACKBAR,
        {
          source: "src/utensils/frieten.ts",
          dependents: [
            "src/snackbar/kapsalon.ts",
            "src/fietsenwinkel/zijspan.ts",
          ],
        }
      ),
      true
    );
  });

  it("must-share (>=2 dependents) with a from pathNot when there's 0 dependents from that from pathNot", () => {
    strictEqual(
      matchModuleRule.matchesDependentsRule(
        MUST_BE_SHARED_BUT_NOT_FROM_SNACKBAR,
        {
          source: "src/utensils/frieten.ts",
          dependents: ["src/snackbar/kapsalon.ts", "src/snackbar/zijspan.ts"],
        }
      ),
      true
    );
  });

  it("must not be used more than 3 times from snackbar - happy scenario", () => {
    strictEqual(
      matchModuleRule.matchesDependentsRule(
        CANNOT_BE_SHARED_MORE_THAN_THREE_TIMES,
        {
          source: "src/utensils/frieten.ts",
          dependents: ["src/snackbar/kapsalon.ts", "src/snackbar/zijspan.ts"],
        }
      ),
      false
    );
  });

  it("must not be used more than 3 times from snackbar - fail scenario", () => {
    strictEqual(
      matchModuleRule.matchesDependentsRule(
        CANNOT_BE_SHARED_MORE_THAN_THREE_TIMES,
        {
          source: "src/utensils/frieten.ts",
          dependents: [
            "src/snackbar/kapsalon.ts",
            "src/snackbar/zijspan.ts",
            "src/snackbar/dooierat.ts",
            "src/snackbar/kipcorn.ts",
          ],
        }
      ),
      false
    );
  });

  it("combo breaker (3 < x < 5) - happy scenario", () => {
    strictEqual(
      matchModuleRule.matchesDependentsRule(USED_FROM_SNACKBAR_BETWEEN, {
        source: "src/utensils/frieten.ts",
        dependents: [
          "src/snackbar/kapsalon.ts",
          "src/snackbar/zijspan.ts",
          "src/snackbar/dooierat.ts",
          "src/snackbar/kipcorn.ts",
        ],
      }),
      false
    );
  });

  it("combo breaker (3 < x < 5) - fail scenario", () => {
    strictEqual(
      matchModuleRule.matchesDependentsRule(USED_FROM_SNACKBAR_BETWEEN, {
        source: "src/utensils/frieten.ts",
        dependents: [
          "src/snackbar/kapsalon.ts",
          "src/snackbar/zijspan.ts",
          "src/snackbar/dooierat.ts",
          "src/snackbar/kipcorn.ts",
          "src/snackbar/bereklauw.ts",
        ],
      }),
      false
    );
  });
});
