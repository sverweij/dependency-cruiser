/* eslint-disable unicorn/no-useless-undefined */
import { deepEqual } from "node:assert/strict";
import $input from "./__fixtures__/focus/dependency-cruiser-only-src.mjs";
import focusOnMainDepthOne from "./__fixtures__/focus/dependency-cruiser-focus-on-main.mjs";
import focusOnMainDepthTwo from "./__fixtures__/focus/dependency-cruiser-focus-on-main-depth-2.mjs";
import addFocus from "#graph-utl/add-focus.mjs";

describe("[U] graph-utl/add-focus", () => {
  it("returns the input modules when there's no pattern", () => {
    deepEqual(addFocus($input), $input);
  });
  it("returns the input modules when there's an undefined pattern", () => {
    // eslint-disable-next-line no-undefined
    deepEqual(addFocus($input, undefined), $input);
  });
  it("returns the input modules when there's a null pattern", () => {
    deepEqual(addFocus($input, null), $input);
  });
  it("mangles the modules to focus on ^src/main if prodded so", () => {
    deepEqual(addFocus($input, { path: "^src/main" }), focusOnMainDepthOne);
  });
  it("mangles the modules to focus on ^src/main if prodded with a depth of two", () => {
    deepEqual(
      addFocus($input, { path: "^src/main", depth: 2 }),
      focusOnMainDepthTwo,
    );
  });
});
