/* eslint-disable unicorn/no-useless-undefined */
import { deepStrictEqual } from "node:assert";
import addFocus from "../../src/graph-utl/add-focus.mjs";
import $input from "./__fixtures__/focus/dependency-cruiser-only-src.mjs";
import focusOnMainDepthOne from "./__fixtures__/focus/dependency-cruiser-focus-on-main.mjs";
import focusOnMainDepthTwo from "./__fixtures__/focus/dependency-cruiser-focus-on-main-depth-2.mjs";

describe("[U] graph-utl/add-focus", () => {
  it("returns the input modules when there's no pattern", () => {
    deepStrictEqual(addFocus($input), $input);
  });
  it("returns the input modules when there's an undefined pattern", () => {
    // eslint-disable-next-line no-undefined
    deepStrictEqual(addFocus($input, undefined), $input);
  });
  it("returns the input modules when there's a null pattern", () => {
    deepStrictEqual(addFocus($input, null), $input);
  });
  it("mangles the modules to focus on ^src/main if prodded so", () => {
    deepStrictEqual(
      addFocus($input, { path: "^src/main" }),
      focusOnMainDepthOne,
    );
  });
  it("mangles the modules to focus on ^src/main if prodded with a depth of two", () => {
    deepStrictEqual(
      addFocus($input, { path: "^src/main", depth: 2 }),
      focusOnMainDepthTwo,
    );
  });
});
