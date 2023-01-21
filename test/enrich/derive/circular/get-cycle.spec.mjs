import { expect } from "chai";
import clearCaches from "../../../../src/enrich/clear-caches.js";
import getCycleOriginal from "../../../../src/enrich/derive/circular/get-cycle.js";
import { findModuleByName } from "../../../../src/enrich/derive/indexed-graph.js";
import inputgraphs from "./__mocks__/inputgraphs.mjs";

function getCycle(pGraph, pFrom, pToDep) {
  return getCycleOriginal(pGraph, pFrom, pToDep, {
    pDependencyName: "resolved",
    pFindNodeByName: findModuleByName,
  });
}

describe("[U] enrich/derive/circular/get-cycle", () => {
  beforeEach("set up", () => {
    clearCaches();
  });
  afterEach("tear down", () => {
    clearCaches();
  });

  it("leaves non circular dependencies alone", () => {
    expect(getCycle(inputgraphs.A_B, "a", "b")).to.deep.equal([]);
  });
  it("detects self circular (c <-> c)", () => {
    expect(getCycle(inputgraphs.C_C, "c", "c")).to.deep.equal(["c", "c"]);
  });
  it("detects 1 step circular (d <-> e)", () => {
    expect(getCycle(inputgraphs.D_E_D, "d", "e")).to.deep.equal(["e", "d"]);
  });
  it("detects 2 step circular (q -> r -> s -> q)", () => {
    expect(getCycle(inputgraphs.Q_R_S_Q, "q", "r")).to.deep.equal([
      "r",
      "s",
      "q",
    ]);
    expect(getCycle(inputgraphs.Q_R_S_Q, "r", "s")).to.deep.equal([
      "s",
      "q",
      "r",
    ]);
    expect(getCycle(inputgraphs.Q_R_S_Q, "s", "q")).to.deep.equal([
      "q",
      "r",
      "s",
    ]);
  });
  it("does not get confused because another circular (t -> u -> t, t -> v)", () => {
    expect(getCycle(inputgraphs.T_U_T_V, "t", "u")).to.deep.equal(["u", "t"]);
    expect(getCycle(inputgraphs.T_U_T_V, "t", "v")).to.deep.equal([]);
  });
  it("detects two circles (a -> b -> c -> a, a -> d -> e -> a)", () => {
    expect(getCycle(inputgraphs.TWO_CIRCLES, "a", "b")).to.deep.equal([
      "b",
      "c",
      "a",
    ]);
    expect(getCycle(inputgraphs.TWO_CIRCLES, "b", "c")).to.deep.equal([
      "c",
      "a",
      "b",
    ]);
    expect(getCycle(inputgraphs.TWO_CIRCLES, "c", "a")).to.deep.equal([
      "a",
      "b",
      "c",
    ]);
    expect(getCycle(inputgraphs.TWO_CIRCLES, "a", "d")).to.deep.equal([
      "d",
      "e",
      "a",
    ]);
    expect(getCycle(inputgraphs.TWO_CIRCLES, "d", "e")).to.deep.equal([
      "e",
      "a",
      "d",
    ]);
    expect(getCycle(inputgraphs.TWO_CIRCLES, "e", "a")).to.deep.equal([
      "a",
      "d",
      "e",
    ]);
  });
  it("it goes to a circle but isn't in it itself (z -> a -> b -> c -> a)", () => {
    expect(getCycle(inputgraphs.TO_A_CIRCLE, "z", "a")).to.deep.equal([]);
  });
  it("it goes to a circle; isn't in it itself, but also to one where it is (z -> a -> b -> c -> a, c -> z)", () => {
    expect(getCycle(inputgraphs.TO_A_CIRCLE_AND_IN_IT, "z", "a")).to.deep.equal(
      ["a", "b", "c", "z"]
    );
  });
  it("just returns one cycle when querying a hub node", () => {
    expect(getCycle(inputgraphs.FLOWER, "a", "b")).to.deep.equal(["b", "a"]);
  });
});
