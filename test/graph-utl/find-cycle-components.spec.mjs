/* eslint-disable no-magic-numbers */
import { deepEqual, equal, notEqual } from "node:assert/strict";
import findCycleComponents from "#graph-utl/find-cycle-components.mjs";

/**
 * @param {Record<string, string[]>} pAdjacency
 * @returns {Map<string, string[]>}
 */
function toGraph(pAdjacency) {
  return new Map(Object.entries(pAdjacency));
}

describe("[U] graph-utl/find-cycle-components", () => {
  it("returns an empty map for an empty graph", () => {
    deepEqual(findCycleComponents(new Map()), new Map());
  });

  it("returns an empty map for a graph without cycles (a -> b -> c, a -> c)", () => {
    deepEqual(
      findCycleComponents(toGraph({ a: ["b", "c"], b: ["c"], c: [] })),
      new Map(),
    );
  });

  it("includes a vertex that depends on itself (a -> a)", () => {
    deepEqual(findCycleComponents(toGraph({ a: ["a"] })), new Map([["a", 0]]));
  });

  it("puts all vertices of a cycle in the same component (a -> b -> c -> a)", () => {
    const lComponents = findCycleComponents(
      toGraph({ a: ["b"], b: ["c"], c: ["a"] }),
    );

    equal(lComponents.size, 3);
    equal(lComponents.get("a"), lComponents.get("b"));
    equal(lComponents.get("b"), lComponents.get("c"));
  });

  it("leaves out vertices that lead to a cycle, or are led to from one, without being on it (z -> a <-> b -> y)", () => {
    const lComponents = findCycleComponents(
      toGraph({ z: ["a"], a: ["b"], b: ["a", "y"], y: [] }),
    );

    deepEqual([...lComponents.keys()].sort(), ["a", "b"]);
  });

  it("puts separate cycles in separate components, also when a dependency leads into a cycle that's already complete (c <-> d, a <-> b -> c)", () => {
    // c <-> d comes first, so it's complete before the search reaches b -> c
    const lComponents = findCycleComponents(
      toGraph({ c: ["d"], d: ["c"], a: ["b"], b: ["c", "a"] }),
    );

    deepEqual([...lComponents.keys()].sort(), ["a", "b", "c", "d"]);
    equal(lComponents.get("a"), lComponents.get("b"));
    equal(lComponents.get("c"), lComponents.get("d"));
    notEqual(lComponents.get("a"), lComponents.get("c"));
  });

  it("puts cycles that share a vertex in the same component (a -> b -> a, a -> c -> a)", () => {
    const lComponents = findCycleComponents(
      toGraph({ a: ["b", "c"], b: ["a"], c: ["a"] }),
    );

    equal(new Set(lComponents.values()).size, 1);
    equal(lComponents.size, 3);
  });

  it("ignores edges to vertices that aren't in the graph (a -> not-in-graph, a <-> b)", () => {
    const lComponents = findCycleComponents(
      toGraph({ a: ["not-in-graph", "b"], b: ["a"] }),
    );

    deepEqual([...lComponents.keys()].sort(), ["a", "b"]);
  });

  it("doesn't exhaust the call stack on a long cycle", () => {
    const lLength = 100_000;
    const lGraph = new Map(
      Array.from({ length: lLength }, (_, pIndex) => [
        `m${pIndex}`,
        [`m${(pIndex + 1) % lLength}`],
      ]),
    );

    equal(findCycleComponents(lGraph).size, lLength);
  });
});
