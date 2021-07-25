import { expect } from "chai";
import normalize from "../../../src/main/options/normalize.js";

describe("main/options/normalize - format options", () => {
  it("makes focus strings into an object", () => {
    expect(
      normalize.normalizeFormatOptions({
        focus: "42",
      }).focus
    ).to.deep.equal({
      path: "42",
    });
  });

  it("makes exclude arrays into an object with a string", () => {
    expect(
      normalize.normalizeFormatOptions({
        exclude: ["^aap", "^noot", "mies$"],
      }).exclude
    ).to.deep.equal({
      path: "^aap|^noot|mies$",
    });
  });

  it("makes exclude object with an array for path into an exclude path with a string for path", () => {
    expect(
      normalize.normalizeFormatOptions({
        exclude: { path: ["^aap", "^noot", "mies$"] },
      }).exclude
    ).to.deep.equal({
      path: "^aap|^noot|mies$",
    });
  });

  it("collapse: normalizes a single digit for collapse to a folder depth regex", () => {
    expect(
      normalize.normalizeFormatOptions({ collapse: "2" }, ["collapse"])
    ).to.deep.equal({
      collapse: "node_modules/[^/]+|^[^/]+/[^/]+/",
    });
  });

  it("collapse: leaves non-single digits alone", () => {
    expect(
      normalize.normalizeFormatOptions({ collapse: "22" }, ["collapse"])
    ).to.deep.equal({
      collapse: "22",
    });
  });

  it("collapse: leaves a normal string/ regex like alone", () => {
    expect(
      normalize.normalizeFormatOptions({ collapse: "^packages/[^/]+" }, [
        "collapse",
      ])
    ).to.deep.equal({
      collapse: "^packages/[^/]+",
    });
  });
});

/* eslint no-magic-numbers: 0*/
