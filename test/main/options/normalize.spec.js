const expect = require("chai").expect;
const normalizeOptions = require("../../../src/main/options/normalize");

describe("main/options/normalize", () => {
  it("ensures maxDepth is an int when passed an int", () => {
    expect(
      normalizeOptions({
        maxDepth: 42,
      }).maxDepth
    ).to.equal(42);
  });

  it("ensures maxDepth is an int when passed a string", () => {
    expect(
      normalizeOptions({
        maxDepth: "42",
      }).maxDepth
    ).to.equal(42);
  });

  it("makes doNotFollow strings into an object", () => {
    expect(
      normalizeOptions({
        doNotFollow: "42",
      }).doNotFollow
    ).to.deep.equal({
      path: "42",
    });
  });
  it("makes focus strings into an object", () => {
    expect(
      normalizeOptions({
        focus: "42",
      }).focus
    ).to.deep.equal({
      path: "42",
    });
  });

  it("makes exclude arrays into an object with a string", () => {
    expect(
      normalizeOptions({
        exclude: ["^aap", "^noot", "mies$"],
      }).exclude
    ).to.deep.equal({
      path: "^aap|^noot|mies$",
    });
  });

  it("makes exclude object with an array for path into an exclude path with a string for path", () => {
    expect(
      normalizeOptions({
        exclude: { path: ["^aap", "^noot", "mies$"] },
      }).exclude
    ).to.deep.equal({
      path: "^aap|^noot|mies$",
    });
  });
});

/* eslint no-magic-numbers: 0*/
