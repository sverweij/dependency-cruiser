/* eslint-disable no-magic-numbers, no-undefined */
import { deepEqual, equal } from "node:assert/strict";
import unIndexedModules from "./__mocks__/un-indexed-modules.mjs";
import unIndexedModulesWithoutDependents from "./__mocks__/un-indexed-modules-without-dependents.mjs";
import cycleInputGraphs from "./__mocks__/cycle-input-graphs.mjs";
import IndexedModuleGraph from "#graph-utl/indexed-module-graph.mjs";

describe("[U] graph-utl/indexed-module-graph - findVertexByName", () => {
  it("searching any module in an empty graph yields undefined", () => {
    const graph = new IndexedModuleGraph([]);

    equal(graph.findVertexByName("any-name"), undefined);
  });

  it("searching a non-exiting module in a real graph yields undefined", () => {
    const graph = new IndexedModuleGraph(unIndexedModules);

    equal(graph.findVertexByName("any-name"), undefined);
  });

  it("searching for an existing module yields that module", () => {
    const graph = new IndexedModuleGraph(unIndexedModules);
    deepEqual(graph.findVertexByName("src/report/dot/default-theme.js"), {
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
    deepEqual(
      graph.findTransitiveDependents("this-module-does-not-exist.mjs"),
      [],
    );
  });

  it("returns just the module itself when the 'dependents' de-normalized attribute isn't in the graph", () => {
    const graph = new IndexedModuleGraph(unIndexedModulesWithoutDependents);
    deepEqual(
      graph.findTransitiveDependents("src/report/dot/default-theme.js"),
      ["src/report/dot/default-theme.js"],
    );
  });

  it("finds just the module itself when there's no transitive dependents", () => {
    const graph = new IndexedModuleGraph(unIndexedModules);
    deepEqual(graph.findTransitiveDependents("src/report/index.js"), [
      "src/report/index.js",
    ]);
  });

  it("finds transitive dependents for an existing module with actual transitive dependents", () => {
    const graph = new IndexedModuleGraph(unIndexedModules);
    deepEqual(
      graph.findTransitiveDependents("src/report/dot/default-theme.js"),
      [
        "src/report/dot/default-theme.js",
        "src/report/dot/theming.js",
        "src/report/dot/index.js",
        "src/report/index.js",
        "src/report/dot/module-utl.js",
        "src/report/dot/prepare-custom-level.js",
        "src/report/dot/prepare-flat-level.js",
        "src/report/dot/prepare-folder-level.js",
      ],
    );
  });

  it("same, but with a max depth of 1", () => {
    const graph = new IndexedModuleGraph(unIndexedModules);
    deepEqual(
      graph.findTransitiveDependents("src/report/dot/default-theme.js", 1),
      ["src/report/dot/default-theme.js", "src/report/dot/theming.js"],
    );
  });

  it("same, but with a max depth of 2", () => {
    const graph = new IndexedModuleGraph(unIndexedModules);
    deepEqual(
      graph.findTransitiveDependents("src/report/dot/default-theme.js", 2),
      [
        "src/report/dot/default-theme.js",
        "src/report/dot/theming.js",
        "src/report/dot/index.js",
        "src/report/dot/module-utl.js",
      ],
    );
  });

  it("same, but with a max depth of 3", () => {
    const graph = new IndexedModuleGraph(unIndexedModules);
    deepEqual(
      graph.findTransitiveDependents("src/report/dot/default-theme.js", 3),
      [
        "src/report/dot/default-theme.js",
        "src/report/dot/theming.js",
        "src/report/dot/index.js",
        "src/report/index.js",
        "src/report/dot/module-utl.js",
        "src/report/dot/prepare-custom-level.js",
        "src/report/dot/prepare-flat-level.js",
        "src/report/dot/prepare-folder-level.js",
      ],
    );
  });

  it("same, but with a max depth of 4 (as there's nothing beyond depth 3 - will yield same as max depth 3", () => {
    const graph = new IndexedModuleGraph(unIndexedModules);
    deepEqual(
      graph.findTransitiveDependents("src/report/dot/default-theme.js", 4),
      [
        "src/report/dot/default-theme.js",
        "src/report/dot/theming.js",
        "src/report/dot/index.js",
        "src/report/index.js",
        "src/report/dot/module-utl.js",
        "src/report/dot/prepare-custom-level.js",
        "src/report/dot/prepare-flat-level.js",
        "src/report/dot/prepare-folder-level.js",
      ],
    );
  });
});

describe("[U] graph-utl/indexed-module-graph - findTransitiveDependencies", () => {
  it("returns an empty array when asking for a non-existing module", () => {
    const graph = new IndexedModuleGraph(unIndexedModules);
    deepEqual(
      graph.findTransitiveDependencies("this-module-does-not-exist.mjs"),
      [],
    );
  });

  it("finds just the module itself when there's no transitive dependencies", () => {
    const graph = new IndexedModuleGraph(unIndexedModules);
    deepEqual(
      graph.findTransitiveDependencies("src/report/dot/default-theme.js"),
      ["src/report/dot/default-theme.js"],
    );
  });

  it("finds transitive dependencies for an existing module with actual transitive dependents", () => {
    const graph = new IndexedModuleGraph(unIndexedModules);
    deepEqual(
      graph.findTransitiveDependencies("src/report/error-html/index.js"),
      [
        "src/report/error-html/index.js",
        "src/report/error-html/error-html.template.js",
        "src/report/error-html/utl.js",
        "src/report/utl/index.js",
      ],
    );
  });

  it("finds direct dependencies for an existing module with actual transitive dependents with pMaxDepth = 1", () => {
    const graph = new IndexedModuleGraph(unIndexedModules);
    const lDirectDependenciesOnlyDepth = 1;

    deepEqual(
      graph.findTransitiveDependencies(
        "src/report/error-html/index.js",
        lDirectDependenciesOnlyDepth,
      ),
      [
        "src/report/error-html/index.js",
        "src/report/error-html/error-html.template.js",
        "src/report/error-html/utl.js",
      ],
    );
  });

  it(" ... max depth 1", () => {
    const graph = new IndexedModuleGraph(unIndexedModules);

    deepEqual(graph.findTransitiveDependencies("src/report/anon/index.js", 1), [
      "src/report/anon/index.js",
      "src/report/anon/anonymize-path.js",
    ]);
  });

  it(" ... max depth 2", () => {
    const graph = new IndexedModuleGraph(unIndexedModules);

    deepEqual(graph.findTransitiveDependencies("src/report/anon/index.js", 2), [
      "src/report/anon/index.js",
      "src/report/anon/anonymize-path.js",
      "src/report/anon/anonymize-path-element.js",
    ]);
  });

  it(" ... max depth 3", () => {
    const graph = new IndexedModuleGraph(unIndexedModules);

    deepEqual(graph.findTransitiveDependencies("src/report/anon/index.js", 3), [
      "src/report/anon/index.js",
      "src/report/anon/anonymize-path.js",
      "src/report/anon/anonymize-path-element.js",
      "src/report/anon/random-string.js",
    ]);
  });

  it(" ... max depth 4 (where there's nothing beyond 3, so should yield the same as max depth 3", () => {
    const graph = new IndexedModuleGraph(unIndexedModules);

    deepEqual(graph.findTransitiveDependencies("src/report/anon/index.js", 4), [
      "src/report/anon/index.js",
      "src/report/anon/anonymize-path.js",
      "src/report/anon/anonymize-path-element.js",
      "src/report/anon/random-string.js",
    ]);
  });
});

describe("[U] graph-utl/indexed-module-graph - getPath", () => {
  it("does not explode when passed an empty graph", () => {
    deepEqual(
      new IndexedModuleGraph([]).getPath("./src/index.js", "./src/hajoo.js"),
      [],
    );
  });

  it("returns [] when from is a lonely module", () => {
    const lGraph = [
      {
        source: "./src/index.js",
        dependencies: [],
      },
    ];

    deepEqual(
      new IndexedModuleGraph(lGraph).getPath(
        "./src/index.js",
        "./src/hajoo.js",
      ),
      [],
    );
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

    deepEqual(
      new IndexedModuleGraph(lGraph).getPath(
        "./src/index.js",
        "./src/hajoo.js",
      ),
      ["./src/hajoo.js"],
    );
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

    deepEqual(
      new IndexedModuleGraph(lGraph).getPath(
        "./src/index.js",
        "./src/index.js",
      ),
      [],
    );
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

    deepEqual(
      new IndexedModuleGraph(lGraph).getPath(
        "./src/index.js",
        "./src/hajoo.js",
      ),
      [],
    );
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

    deepEqual(
      new IndexedModuleGraph(lGraph).getPath(
        "./src/index.js",
        "./src/hajoo.js",
      ),
      ["./src/intermediate.js", "./src/hajoo.js"],
    );
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

    deepEqual(
      new IndexedModuleGraph(lGraph).getPath(
        "./src/index.js",
        "./src/hajoo.js",
      ),
      [],
    );
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

    deepEqual(
      new IndexedModuleGraph(lGraph).getPath(
        "./src/index.js",
        "./src/hajoo.js",
      ),
      ["./src/intermediate.js", "./src/hajoo.js"],
    );
  });
});

function getCycle(pGraph, pFrom, pToDep) {
  const lIndexedGraph = new IndexedModuleGraph(pGraph);
  return lIndexedGraph.getCycle(pFrom, pToDep).map(({ name }) => name);
}

describe("[U] graph-utl/indexed-module-graph - getCycle (algorithm check)", () => {
  it("leaves non circular dependencies alone", () => {
    deepEqual(getCycle(cycleInputGraphs.A_B, "a", "b"), []);
  });
  it("detects self circular (c <-> c)", () => {
    deepEqual(getCycle(cycleInputGraphs.C_C, "c", "c"), ["c"]);
  });
  it("detects 1 step circular (d <-> e)", () => {
    deepEqual(getCycle(cycleInputGraphs.D_E_D, "d", "e"), ["e", "d"]);
  });
  it("detects 2 step circular (q -> r -> s -> q)", () => {
    deepEqual(getCycle(cycleInputGraphs.Q_R_S_Q, "q", "r"), ["r", "s", "q"]);
    deepEqual(getCycle(cycleInputGraphs.Q_R_S_Q, "r", "s"), ["s", "q", "r"]);
    deepEqual(getCycle(cycleInputGraphs.Q_R_S_Q, "s", "q"), ["q", "r", "s"]);
  });
  it("does not get confused because another circular (t -> u -> t, t -> v)", () => {
    deepEqual(getCycle(cycleInputGraphs.T_U_T_V, "t", "u"), ["u", "t"]);
    deepEqual(getCycle(cycleInputGraphs.T_U_T_V, "t", "v"), []);
  });
  it("detects two circles (a -> b -> c -> a, a -> d -> e -> a)", () => {
    deepEqual(getCycle(cycleInputGraphs.TWO_CIRCLES, "a", "b"), [
      "b",
      "c",
      "a",
    ]);
    deepEqual(getCycle(cycleInputGraphs.TWO_CIRCLES, "b", "c"), [
      "c",
      "a",
      "b",
    ]);
    deepEqual(getCycle(cycleInputGraphs.TWO_CIRCLES, "c", "a"), [
      "a",
      "b",
      "c",
    ]);
    deepEqual(getCycle(cycleInputGraphs.TWO_CIRCLES, "a", "d"), [
      "d",
      "e",
      "a",
    ]);
    deepEqual(getCycle(cycleInputGraphs.TWO_CIRCLES, "d", "e"), [
      "e",
      "a",
      "d",
    ]);
    deepEqual(getCycle(cycleInputGraphs.TWO_CIRCLES, "e", "a"), [
      "a",
      "d",
      "e",
    ]);
  });
  it("it goes to a circle but isn't in it itself (z -> a -> b -> c -> a)", () => {
    deepEqual(getCycle(cycleInputGraphs.TO_A_CIRCLE, "z", "a"), []);
  });
  it("it goes to a circle; isn't in it itself, but also to one where it is (z -> a -> b -> c -> a, c -> z)", () => {
    deepEqual(getCycle(cycleInputGraphs.TO_A_CIRCLE_AND_IN_IT, "z", "a"), [
      "a",
      "b",
      "c",
      "z",
    ]);
  });
  it("just returns one cycle when querying a hub node", () => {
    deepEqual(getCycle(cycleInputGraphs.FLOWER, "a", "b"), ["b", "a"]);
  });
  it("if the 'to' node is not in the graph, it returns []", () => {
    deepEqual(getCycle(cycleInputGraphs.D_E_D, "d", "not-in-graph"), []);
  });
});

function getCycleRich(pGraph, pFrom, pToDep) {
  const lIndexedGraph = new IndexedModuleGraph(pGraph);
  return lIndexedGraph.getCycle(pFrom, pToDep);
}

describe("[U] graph-utl/indexed-module-graph - getCycle (verify the necessary attributes are there)", () => {
  it("returns the cycle with the 'name' and 'dependencyTypes' attributes added (and none else)", () => {
    const lCycle = getCycleRich(cycleInputGraphs.D_E_D, "d", "e");
    deepEqual(lCycle, [
      {
        name: "e",
        dependencyTypes: [
          "aliased",
          "aliased-subpath-import",
          "local",
          "import",
        ],
      },
      {
        name: "d",
        dependencyTypes: ["local", "import"],
      },
    ]);
  });
  it("returns the cycle with the 'name' and 'dependencyTypes' attributes even when dependencyTypes wasn't defined", () => {
    const lCycle = getCycleRich(cycleInputGraphs.FLOWER, "a", "b");
    deepEqual(lCycle, [
      {
        name: "b",
        dependencyTypes: [],
      },
      {
        name: "a",
        dependencyTypes: [],
      },
    ]);
  });
});
