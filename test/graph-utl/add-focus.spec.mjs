/* eslint-disable unicorn/no-useless-undefined */
import { expect } from "chai";
import addFocus from "../../src/graph-utl/add-focus.mjs";
import $input from "./__fixtures__/focus/dependency-cruiser-only-src.mjs";
import focusOnMainDepthOne from "./__fixtures__/focus/dependency-cruiser-focus-on-main.mjs";
import focusOnMainDepthTwo from "./__fixtures__/focus/dependency-cruiser-focus-on-main-depth-2.mjs";

describe("[U] graph-utl/add-focus", () => {
  it("returns the input modules when there's no pattern", () => {
    expect(addFocus($input)).to.deep.equal($input);
  });
  it("returns the input modules when there's an undefined pattern", () => {
    // eslint-disable-next-line no-undefined
    expect(addFocus($input, undefined)).to.deep.equal($input);
  });
  it("returns the input modules when there's a null pattern", () => {
    expect(addFocus($input, null)).to.deep.equal($input);
  });
  it("mangles the modules to focus on ^src/main if prodded so", () => {
    expect(addFocus($input, { path: "^src/main" })).to.deep.equal(
      focusOnMainDepthOne
    );
  });
  it("mangles the modules to focus on ^src/main if prodded with a depth of two", () => {
    expect(addFocus($input, { path: "^src/main", depth: 2 })).to.deep.equal(
      focusOnMainDepthTwo
    );
  });
});
