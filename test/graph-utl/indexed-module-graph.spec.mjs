/* eslint-disable no-magic-numbers */
import { expect } from "chai";
import IndexedModuleGraph from "../../src/graph-utl/indexed-module-graph.mjs";
import unIndexedModules from "./__mocks__/un-indexed-modules.mjs";
import unIndexedModulesWithoutDependents from "./__mocks__/un-indexed-modules-without-dependents.mjs";
import cycleInputGraphs from "./__mocks__/cycle-input-graphs.mjs";

describe("[U] graph-utl/indexed-module-graph - findModuleByName", () => {
  it("searching any module in an empty graph yields undefined", () => {
    const graph = new IndexedModuleGraph([]);
    // eslint-disable-next-line no-undefined
    expect(graph.findModuleByName("any-name")).to.deep.equal(undefined);
  });

  it("searching a non-exiting module in a real graph yields undefined", () => {
    const graph = new IndexedModuleGraph(unIndexedModules);
    // eslint-disable-next-line no-undefined
    expect(graph.findModuleByName("any-name")).to.deep.equal(undefined);
  });

  it("searching for an existing module yields that module", () => {
    const graph = new IndexedModuleGraph(unIndexedModules);
    expect(
      graph.findModuleByName("src/report/dot/default-theme.js")
    ).to.deep.equal({
      source: "src/report/dot/default-theme.js",
      dependencies: [],
      dependents: ["src/report/dot/theming.js"],
      orphan: false,
      reachable: [
        {
          value: true,
          asDefinedInRule: "not-reachable-from-folder-index",
          matchedFrom: "src/report/index.js",
        },
      ],
      valid: true,
    });
  });
});

describe("[U] graph-utl/indexed-module-graph - findTransitiveDependents", () => {
  it("returns an empty array when asking for a non-existing module", () => {
    const graph = new IndexedModuleGraph(unIndexedModules);
    expect(
      graph.findTransitiveDependents("this-module-does-not-exist.mjs")
    ).to.deep.equal([]);
  });

  it("returns just the module itself when the 'dependents' de-normalized attribute isn't in the graph", () => {
    const graph = new IndexedModuleGraph(unIndexedModulesWithoutDependents);
    expect(
      graph.findTransitiveDependents("src/report/dot/default-theme.js")
    ).to.deep.equal(["src/report/dot/default-theme.js"]);
  });

  it("finds just the module itself when there's no transitive dependents", () => {
    const graph = new IndexedModuleGraph(unIndexedModules);
    expect(graph.findTransitiveDependents("src/report/index.js")).to.deep.equal(
      ["src/report/index.js"]
    );
  });

  it("finds transitive dependents for an existing module with actual transitive dependents", () => {
    const graph = new IndexedModuleGraph(unIndexedModules);
    expect(
      graph.findTransitiveDependents("src/report/dot/default-theme.js")
    ).to.deep.equal([
      "src/report/dot/default-theme.js",
      "src/report/dot/theming.js",
      "src/report/dot/index.js",
      "src/report/index.js",
      "src/report/dot/module-utl.js",
      "src/report/dot/prepare-custom-level.js",
      "src/report/dot/prepare-flat-level.js",
      "src/report/dot/prepare-folder-level.js",
    ]);
  });

  it("same, but with a max depth of 1", () => {
    const graph = new IndexedModuleGraph(unIndexedModules);
    expect(
      graph.findTransitiveDependents("src/report/dot/default-theme.js", 1)
    ).to.deep.equal([
      "src/report/dot/default-theme.js",
      "src/report/dot/theming.js",
    ]);
  });

  it("same, but with a max depth of 2", () => {
    const graph = new IndexedModuleGraph(unIndexedModules);
    expect(
      graph.findTransitiveDependents("src/report/dot/default-theme.js", 2)
    ).to.deep.equal([
      "src/report/dot/default-theme.js",
      "src/report/dot/theming.js",
      "src/report/dot/index.js",
      "src/report/dot/module-utl.js",
    ]);
  });

  it("same, but with a max depth of 3", () => {
    const graph = new IndexedModuleGraph(unIndexedModules);
    expect(
      graph.findTransitiveDependents("src/report/dot/default-theme.js", 3)
    ).to.deep.equal([
      "src/report/dot/default-theme.js",
      "src/report/dot/theming.js",
      "src/report/dot/index.js",
      "src/report/index.js",
      "src/report/dot/module-utl.js",
      "src/report/dot/prepare-custom-level.js",
      "src/report/dot/prepare-flat-level.js",
      "src/report/dot/prepare-folder-level.js",
    ]);
  });

  it("same, but with a max depth of 4 (as there's nothing beyond depth 3 - will yield same as max depth 3", () => {
    const graph = new IndexedModuleGraph(unIndexedModules);
    expect(
      graph.findTransitiveDependents("src/report/dot/default-theme.js", 4)
    ).to.deep.equal([
      "src/report/dot/default-theme.js",
      "src/report/dot/theming.js",
      "src/report/dot/index.js",
      "src/report/index.js",
      "src/report/dot/module-utl.js",
      "src/report/dot/prepare-custom-level.js",
      "src/report/dot/prepare-flat-level.js",
      "src/report/dot/prepare-folder-level.js",
    ]);
  });
});

describe("[U] graph-utl/indexed-module-graph - findTransitiveDependencies", () => {
  it("returns an empty array when asking for a non-existing module", () => {
    const graph = new IndexedModuleGraph(unIndexedModules);
    expect(
      graph.findTransitiveDependencies("this-module-does-not-exist.mjs")
    ).to.deep.equal([]);
  });

  it("finds just the module itself when there's no transitive dependencies", () => {
    const graph = new IndexedModuleGraph(unIndexedModules);
    expect(
      graph.findTransitiveDependencies("src/report/dot/default-theme.js")
    ).to.deep.equal(["src/report/dot/default-theme.js"]);
  });

  it("finds transitive dependencies for an existing module with actual transitive dependents", () => {
    const graph = new IndexedModuleGraph(unIndexedModules);
    expect(
      graph.findTransitiveDependencies("src/report/error-html/index.js")
    ).to.deep.equal([
      "src/report/error-html/index.js",
      "src/report/error-html/error-html.template.js",
      "src/report/error-html/utl.js",
      "src/report/utl/index.js",
    ]);
  });

  it("finds direct dependencies for an existing module with actual transitive dependents with pMaxDepth = 1", () => {
    const graph = new IndexedModuleGraph(unIndexedModules);
    const lDirectDependenciesOnlyDepth = 1;

    expect(
      graph.findTransitiveDependencies(
        "src/report/error-html/index.js",
        lDirectDependenciesOnlyDepth
      )
    ).to.deep.equal([
      "src/report/error-html/index.js",
      "src/report/error-html/error-html.template.js",
      "src/report/error-html/utl.js",
    ]);
  });

  it(" ... max depth 1", () => {
    const graph = new IndexedModuleGraph(unIndexedModules);

    expect(
      graph.findTransitiveDependencies("src/report/anon/index.js", 1)
    ).to.deep.equal([
      "src/report/anon/index.js",
      "src/report/anon/anonymize-path.js",
    ]);
  });

  it(" ... max depth 2", () => {
    const graph = new IndexedModuleGraph(unIndexedModules);

    expect(
      graph.findTransitiveDependencies("src/report/anon/index.js", 2)
    ).to.deep.equal([
      "src/report/anon/index.js",
      "src/report/anon/anonymize-path.js",
      "src/report/anon/anonymize-path-element.js",
    ]);
  });

  it(" ... max depth 3", () => {
    const graph = new IndexedModuleGraph(unIndexedModules);

    expect(
      graph.findTransitiveDependencies("src/report/anon/index.js", 3)
    ).to.deep.equal([
      "src/report/anon/index.js",
      "src/report/anon/anonymize-path.js",
      "src/report/anon/anonymize-path-element.js",
      "src/report/anon/random-string.js",
    ]);
  });

  it(" ... max depth 4 (where there's nothing beyond 3, so should yield the same as max depth 3", () => {
    const graph = new IndexedModuleGraph(unIndexedModules);

    expect(
      graph.findTransitiveDependencies("src/report/anon/index.js", 4)
    ).to.deep.equal([
      "src/report/anon/index.js",
      "src/report/anon/anonymize-path.js",
      "src/report/anon/anonymize-path-element.js",
      "src/report/anon/random-string.js",
    ]);
  });
});

describe("[U] graph-utl/indexed-module-graph - getPath", () => {
  it("does not explode when passed an empty graph", () => {
    expect(
      new IndexedModuleGraph([]).getPath("./src/index.js", "./src/hajoo.js")
    ).to.deep.equal([]);
  });

  it("returns [] when from is a lonely module", () => {
    const lGraph = [
      {
        source: "./src/index.js",
        dependencies: [],
      },
    ];

    expect(
      new IndexedModuleGraph(lGraph).getPath("./src/index.js", "./src/hajoo.js")
    ).to.deep.equal([]);
  });

  it("returns [from, to] when from is a direct dependency of from", () => {
    const lGraph = [
      {
        source: "./src/index.js",
        dependencies: [
          {
            resolved: "./src/hajoo.js",
          },
        ],
      },
    ];

    expect(
      new IndexedModuleGraph(lGraph).getPath("./src/index.js", "./src/hajoo.js")
    ).to.deep.equal(["./src/index.js", "./src/hajoo.js"]);
  });

  it("returns [] when to == from", () => {
    const lGraph = [
      {
        source: "./src/index.js",
        dependencies: [
          {
            resolved: "./src/hajoo.js",
          },
        ],
      },
    ];

    expect(
      new IndexedModuleGraph(lGraph).getPath("./src/index.js", "./src/index.js")
    ).to.deep.equal([]);
  });

  it("returns [] when to is not in dependencies of from", () => {
    const lGraph = [
      {
        source: "./src/index.js",
        dependencies: [
          {
            resolved: "./src/noooo.js",
          },
        ],
      },
    ];

    expect(
      new IndexedModuleGraph(lGraph).getPath("./src/index.js", "./src/hajoo.js")
    ).to.deep.equal([]);
  });

  it("returns true when to is a dependency one removed of from", () => {
    const lGraph = [
      {
        source: "./src/index.js",
        dependencies: [
          {
            resolved: "./src/intermediate.js",
          },
        ],
      },
      {
        source: "./src/intermediate.js",
        dependencies: [
          {
            resolved: "./src/hajoo.js",
          },
        ],
      },
    ];

    expect(
      new IndexedModuleGraph(lGraph).getPath("./src/index.js", "./src/hajoo.js")
    ).to.deep.equal([
      "./src/index.js",
      "./src/intermediate.js",
      "./src/hajoo.js",
    ]);
  });

  it("doesn't get dizzy when a dep is circular (did not find to)", () => {
    const lGraph = [
      {
        source: "./src/index.js",
        dependencies: [
          {
            resolved: "./src/intermediate.js",
          },
        ],
      },
      {
        source: "./src/intermediate.js",
        dependencies: [
          {
            resolved: "./src/index.js",
          },
        ],
      },
    ];

    expect(
      new IndexedModuleGraph(lGraph).getPath("./src/index.js", "./src/hajoo.js")
    ).to.deep.equal([]);
  });

  it("doesn't get dizzy when a dep is circular (did find to)", () => {
    const lGraph = [
      {
        source: "./src/index.js",
        dependencies: [
          {
            resolved: "./src/intermediate.js",
          },
        ],
      },
      {
        source: "./src/intermediate.js",
        dependencies: [
          {
            resolved: "./src/index.js",
          },
          {
            resolved: "./src/hajoo.js",
          },
        ],
      },
      {
        source: "./src/hajoo.js",
        dependencies: [],
      },
    ];

    expect(
      new IndexedModuleGraph(lGraph).getPath("./src/index.js", "./src/hajoo.js")
    ).to.deep.equal([
      "./src/index.js",
      "./src/intermediate.js",
      "./src/hajoo.js",
    ]);
  });
});

function getCycle(pGraph, pFrom, pToDep) {
  const lIndexedGraph = new IndexedModuleGraph(pGraph);
  return lIndexedGraph.getCycle(pFrom, pToDep, "resolved");
}

describe("[U] graph-utl/indexed-module-graph - getCycle", () => {
  it("leaves non circular dependencies alone", () => {
    expect(getCycle(cycleInputGraphs.A_B, "a", "b")).to.deep.equal([]);
  });
  it("detects self circular (c <-> c)", () => {
    expect(getCycle(cycleInputGraphs.C_C, "c", "c")).to.deep.equal(["c", "c"]);
  });
  it("detects 1 step circular (d <-> e)", () => {
    expect(getCycle(cycleInputGraphs.D_E_D, "d", "e")).to.deep.equal([
      "e",
      "d",
    ]);
  });
  it("detects 2 step circular (q -> r -> s -> q)", () => {
    expect(getCycle(cycleInputGraphs.Q_R_S_Q, "q", "r")).to.deep.equal([
      "r",
      "s",
      "q",
    ]);
    expect(getCycle(cycleInputGraphs.Q_R_S_Q, "r", "s")).to.deep.equal([
      "s",
      "q",
      "r",
    ]);
    expect(getCycle(cycleInputGraphs.Q_R_S_Q, "s", "q")).to.deep.equal([
      "q",
      "r",
      "s",
    ]);
  });
  it("does not get confused because another circular (t -> u -> t, t -> v)", () => {
    expect(getCycle(cycleInputGraphs.T_U_T_V, "t", "u")).to.deep.equal([
      "u",
      "t",
    ]);
    expect(getCycle(cycleInputGraphs.T_U_T_V, "t", "v")).to.deep.equal([]);
  });
  it("detects two circles (a -> b -> c -> a, a -> d -> e -> a)", () => {
    expect(getCycle(cycleInputGraphs.TWO_CIRCLES, "a", "b")).to.deep.equal([
      "b",
      "c",
      "a",
    ]);
    expect(getCycle(cycleInputGraphs.TWO_CIRCLES, "b", "c")).to.deep.equal([
      "c",
      "a",
      "b",
    ]);
    expect(getCycle(cycleInputGraphs.TWO_CIRCLES, "c", "a")).to.deep.equal([
      "a",
      "b",
      "c",
    ]);
    expect(getCycle(cycleInputGraphs.TWO_CIRCLES, "a", "d")).to.deep.equal([
      "d",
      "e",
      "a",
    ]);
    expect(getCycle(cycleInputGraphs.TWO_CIRCLES, "d", "e")).to.deep.equal([
      "e",
      "a",
      "d",
    ]);
    expect(getCycle(cycleInputGraphs.TWO_CIRCLES, "e", "a")).to.deep.equal([
      "a",
      "d",
      "e",
    ]);
  });
  it("it goes to a circle but isn't in it itself (z -> a -> b -> c -> a)", () => {
    expect(getCycle(cycleInputGraphs.TO_A_CIRCLE, "z", "a")).to.deep.equal([]);
  });
  it("it goes to a circle; isn't in it itself, but also to one where it is (z -> a -> b -> c -> a, c -> z)", () => {
    expect(
      getCycle(cycleInputGraphs.TO_A_CIRCLE_AND_IN_IT, "z", "a")
    ).to.deep.equal(["a", "b", "c", "z"]);
  });
  it("just returns one cycle when querying a hub node", () => {
    expect(getCycle(cycleInputGraphs.FLOWER, "a", "b")).to.deep.equal([
      "b",
      "a",
    ]);
  });
});
