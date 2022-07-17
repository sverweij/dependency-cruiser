import { expect } from "chai";
import IndexedModuleGraph from "../../src/graph-utl/indexed-module-graph.js";
import unIndexedModules from "./__mocks__/un-indexed-modules.mjs";
import unIndexedModulesWithoutDependents from "./__mocks__/un-indexed-modules-without-dependents.mjs";

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
});
