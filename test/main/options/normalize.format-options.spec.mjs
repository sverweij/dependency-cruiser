import { expect } from "chai";
import { normalizeFormatOptions } from "../../../src/main/options/normalize.mjs";

describe("[U] main/options/normalize - format options", () => {
  it("makes focus strings into an object", () => {
    expect(
      normalizeFormatOptions({
        focus: "42",
      }).focus
    ).to.deep.equal({
      path: "42",
    });
  });

  it("makes focus strings into an object - with addition of focus depth if it's there", () => {
    expect(
      normalizeFormatOptions({
        focus: "42",
        focusDepth: 10,
      }).focus
    ).to.deep.equal({
      path: "42",
      depth: 10,
    });
  });

  it("ignores focus depth when there's not also a focus attribute", () => {
    expect(
      normalizeFormatOptions({
        focusDepth: 10,
      })
    ).to.deep.equal({});
  });

  it("makes exclude arrays into an object with a string", () => {
    expect(
      normalizeFormatOptions({
        exclude: ["^aap", "^noot", "mies$"],
      }).exclude
    ).to.deep.equal({
      path: "^aap|^noot|mies$",
    });
  });

  it("makes exclude object with an array for path into an exclude path with a string for path", () => {
    expect(
      normalizeFormatOptions({
        exclude: { path: ["^aap", "^noot", "mies$"] },
      }).exclude
    ).to.deep.equal({
      path: "^aap|^noot|mies$",
    });
  });

  it("collapse: normalizes a single digit for collapse to a folder depth regex", () => {
    expect(
      normalizeFormatOptions({ collapse: "2" }, ["collapse"])
    ).to.deep.equal({
      collapse: "node_modules/[^/]+|^[^/]+/[^/]+/",
    });
  });

  it("collapse: leaves non-single digits alone", () => {
    expect(
      normalizeFormatOptions({ collapse: "22" }, ["collapse"])
    ).to.deep.equal({
      collapse: "22",
    });
  });

  it("collapse: leaves a normal string/ regex like alone", () => {
    expect(
      normalizeFormatOptions({ collapse: "^packages/[^/]+" }, ["collapse"])
    ).to.deep.equal({
      collapse: "^packages/[^/]+",
    });
  });
});

/* eslint no-magic-numbers: 0*/
