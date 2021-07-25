/* eslint-disable unicorn/no-useless-undefined */
import { expect } from "chai";
import addFocus from "../../src/graph-utl/add-focus.js";
import $input from "./fixtures/focus/dependency-cruiser-only-src.mjs";
import $focus from "./fixtures/focus/dependency-cruiser-focus-on-main.mjs";

describe("enrich/add-focus", () => {
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
    expect(addFocus($input, { path: "^src/main" })).to.deep.equal($focus);
  });
});
