import { deepEqual, equal } from "node:assert/strict";
import addDependents, {
  hasDependentsRule,
  getDependents,
} from "#enrich/derive/dependents.mjs";

describe("[U] enrich/derive/dependents - has-dependents-rule", () => {
  it("returns false on an empty rule set", () => {
    equal(hasDependentsRule({}), false);
  });

  it("returns false on a rule set without rules that need dependents analysed", () => {
    equal(hasDependentsRule({ forbidden: [{ from: {}, to: {} }] }), false);
  });

  it("returns true on a rule set without rules that need dependents analysed (less, forbidden)", () => {
    equal(
      hasDependentsRule({
        forbidden: [{ module: { numberOfDependentsLessThan: 3 }, from: {} }],
      }),
      true,
    );
  });

  it("returns true on a rule set without rules that need dependents analysed (more, forbidden)", () => {
    equal(
      hasDependentsRule({
        forbidden: [{ module: { numberOfDependentsLessThan: 3 }, from: {} }],
      }),
      true,
    );
  });

  it("returns true on a rule set without rules that need dependents analysed (less, allowed)", () => {
    equal(
      hasDependentsRule({
        allowed: [{ module: { numberOfDependentsLessThan: 3 }, from: {} }],
      }),
      true,
    );
  });

  it("returns true on a rule set without rules that need dependents analysed (more, allowed)", () => {
    equal(
      hasDependentsRule({
        allowed: [{ module: { numberOfDependentsMoreThan: 3 }, from: {} }],
      }),
      true,
    );
  });
});

describe("[U] enrich/derive/dependents - addDependents", () => {
  const lModules = [
    { source: "a", dependencies: [{ resolved: "b" }, { resolved: "c" }] },
    { source: "b", dependencies: [{ resolved: "c" }] },
    { source: "c", dependencies: [] },
  ];
  const lModulesWithDependents = [
    {
      source: "a",
      dependencies: [{ resolved: "b" }, { resolved: "c" }],
      dependents: [],
    },
    { source: "b", dependencies: [{ resolved: "c" }], dependents: ["a"] },
    { source: "c", dependencies: [], dependents: ["a", "b"] },
  ];
  const lRuleSetWithDependents = {
    forbidden: [{ module: { numberOfDependentsLessThan: 3 }, from: {} }],
  };

  it("returns the input when skipAnalysisNotInRules=true, there's no metrics and the rule set is not provided", () => {
    deepEqual(
      addDependents(lModules, { skipAnalysisNotInRules: true }),
      lModules,
    );
  });

  it("returns the input when skipAnalysisNotInRules=true, there's no metrics and the rule set is empty", () => {
    deepEqual(
      addDependents(lModules, { skipAnalysisNotInRules: true, ruleSet: {} }),
      lModules,
    );
  });

  it("returns the input enriched with dependents when skipAnalysisNotInRules=true, there's no metrics and the rule set needs dependents", () => {
    deepEqual(
      addDependents(lModules, {
        skipAnalysisNotInRules: true,
        ruleSet: lRuleSetWithDependents,
      }),
      lModulesWithDependents,
    );
  });

  it("returns the input enriched with dependents when skipAnalysisNotInRules=true and metrics need to be calculated", () => {
    deepEqual(
      addDependents(lModules, { skipAnalysisNotInRules: true, metrics: true }),
      lModulesWithDependents,
    );
  });

  it("returns the input enriched with dependents with skipAnalysisNotInRules=false", () => {
    deepEqual(
      addDependents(lModules, { skipAnalysisNotInRules: false }),
      lModulesWithDependents,
    );
  });
});

describe("[U] enrich/derive/dependents - get-dependents", () => {
  it("empty module without a source name & no modules yield no modules", () => {
    deepEqual(getDependents({}, []), []);
  });

  it("module & no modules yield no modules", () => {
    deepEqual(getDependents({ source: "itsme" }, []), []);
  });

  it("module & modules without any dependencies yield no modules", () => {
    deepEqual(
      getDependents({ source: "itsme" }, [
        {
          source: "someoneelse",
          dependencies: new Set([]),
        },
      ]),
      [],
    );
  });

  it("module & modules with non-matching dependencies yield no modules", () => {
    deepEqual(
      getDependents({ source: "itsme" }, [
        {
          source: "someoneelse",
          dependencies: new Set(["itsnotme"]),
        },
      ]),
      [],
    );
  });

  it("module & module that's dependent yields that other module", () => {
    deepEqual(
      getDependents({ source: "itsme" }, [
        {
          source: "someoneelse",
          dependencies: new Set(["itsnotme", "itsme"]),
        },
      ]),
      ["someoneelse"],
    );
  });

  it("module & modules that are dependent yields those other modules", () => {
    deepEqual(
      getDependents({ source: "itsme" }, [
        {
          source: "someoneelse",
          dependencies: new Set(["itsnotme", "itsme"]),
        },
        {
          source: "someoneelse-again",
          dependencies: new Set([
            "notme",
            "notmeagain",
            "itsme",
            "itsnotmeeither",
          ]),
        },
      ]),
      ["someoneelse", "someoneelse-again"],
    );
  });
});
