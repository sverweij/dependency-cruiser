const expect = require("chai").expect;
const addFocus = require("../../src/enrich/add-focus");
const $input = require("./fixtures/focus/dependency-cruiser-only-src.json");
const $focus = require("./fixtures/focus/dependency-cruiser-focus-on-main.json");

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
