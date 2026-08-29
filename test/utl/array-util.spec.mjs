import { equal } from "node:assert/strict";
import { intersects } from "#utl/array-util.mjs";

describe("[U] utl/array-util - intersects", () => {
  it("returns false when both arrays are empty", () => {
    equal(intersects([], []), false);
  });

  it("returns false when the left array is empty", () => {
    equal(intersects([], ["aap", "noot"]), false);
  });

  it("returns false when the right array is empty", () => {
    equal(intersects(["aap", "noot"], []), false);
  });

  it("returns true when the arrays share one element", () => {
    equal(intersects(["aap", "noot"], ["mies", "noot"]), true);
  });

  it("returns true when the arrays share multiple elements", () => {
    equal(intersects(["aap", "noot"], ["noot", "aap"]), true);
  });

  it("returns true when the arrays are identical", () => {
    equal(intersects(["aap", "noot"], ["aap", "noot"]), true);
  });

  it("returns true when the right array is longer and shares an element", () => {
    equal(intersects(["noot"], ["aap", "noot", "mies"]), true);
  });

  it("returns true when the left array is longer and shares an element", () => {
    equal(intersects(["aap", "noot", "mies"], ["noot"]), true);
  });

  it("returns false when the arrays share no elements", () => {
    equal(intersects(["aap", "noot"], ["mies", "wim"]), false);
  });

  it("returns false when the left array is longer and shares no elements", () => {
    equal(intersects(["aap", "noot", "mies"], ["wim", "zus"]), false);
  });

  it("returns false for elements that only partially match", () => {
    equal(intersects(["aap"], ["aapje"]), false);
  });
});
