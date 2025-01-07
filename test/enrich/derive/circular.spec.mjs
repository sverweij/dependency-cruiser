import assert from "node:assert/strict";
import detectAndAddCycles, { hasCycleRule } from "#enrich/derive/circular.mjs";
import IndexedModuleGraph from "#graph-utl/indexed-module-graph.mjs";

describe("[U] enrich/circular - hasCycleRule", () => {
  it("returns false for empty lRuleSet", () => {
    assert.equal(hasCycleRule({}), false);
  });

  it("returns true when forbidden rules contain circular", () => {
    const lRuleSet = {
      forbidden: [{ from: {}, to: { circular: true } }],
    };
    assert.equal(hasCycleRule(lRuleSet), true);
  });

  it("returns true when allowed rule contain circular", () => {
    const lRuleSet = {
      allowed: [{ from: {}, to: { circular: true } }],
    };
    assert.equal(hasCycleRule(lRuleSet), true);
  });
});

describe("[U] enrich/circular - detectAndAddCycles", () => {
  it("adds circular: false when no cycles", () => {
    const lNodes = [
      {
        source: "x",
        dependencies: [{ resolved: "y" }],
      },
      {
        source: "y",
        dependencies: [],
      },
    ];
    const lMockIndexedNodes = new IndexedModuleGraph(lNodes);

    const lResult = detectAndAddCycles(lNodes, lMockIndexedNodes, {
      pSourceAttribute: "source",
      pDependencyName: "resolved",
      pSkipAnalysisNotInRules: false,
    });

    assert.deepEqual(lResult[0].dependencies[0].circular, false);
  });

  it("detects and adds cycles", () => {
    const lNodes = [
      {
        source: "a",
        dependencies: [{ resolved: "b" }],
      },
      {
        source: "b",
        dependencies: [{ resolved: "a" }],
      },
    ];
    const lMockIndexedNodes = new IndexedModuleGraph(lNodes);

    const lResult = detectAndAddCycles(lNodes, lMockIndexedNodes, {
      pSourceAttribute: "source",
      pDependencyName: "resolved",
      pSkipAnalysisNotInRules: false,
    });

    assert.equal(lResult[0].dependencies[0].circular, true);
    assert.deepEqual(lResult[0].dependencies[0].cycle, [
      { name: "b", dependencyTypes: [] },
      { name: "a", dependencyTypes: [] },
    ]);
  });

  it("skips analysis when pSkipAnalysisNotInRules=true and no cycle rules", () => {
    const lNodes = [
      {
        source: "a",
        dependencies: [{ resolved: "b" }],
      },
      {
        source: "b",
        dependencies: [{ resolved: "a" }],
      },
    ];
    const lMockIndexedNodes = new IndexedModuleGraph(lNodes);

    const lResult = detectAndAddCycles(lNodes, lMockIndexedNodes, {
      pSourceAttribute: "source",
      pDependencyName: "resolved",
      pSkipAnalysisNotInRules: true,
      pRuleSet: {},
    });

    assert.equal(lResult[0].dependencies[0].circular, false);
    // eslint-disable-next-line no-undefined
    assert.equal(lResult[0].dependencies[0].cycle, undefined);
  });

  it("performs analysis when pSkipAnalysisNotInRules=true but cycle rules exist", () => {
    const lNodes = [
      {
        source: "a",
        dependencies: [{ resolved: "b" }],
      },
      {
        source: "b",
        dependencies: [{ resolved: "a" }],
      },
    ];
    const lIndexedNodes = new IndexedModuleGraph(lNodes);

    const lResult = detectAndAddCycles(lNodes, lIndexedNodes, {
      pSourceAttribute: "source",
      pDependencyName: "resolved",
      pSkipAnalysisNotInRules: true,
      pRuleSet: {
        forbidden: [{ from: {}, to: { circular: true } }],
      },
    });

    assert.equal(lResult[0].dependencies[0].circular, true);
    assert.deepEqual(lResult[0].dependencies[0].cycle, [
      { name: "b", dependencyTypes: [] },
      { name: "a", dependencyTypes: [] },
    ]);
  });
});
