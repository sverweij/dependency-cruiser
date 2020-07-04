const { expect } = require("chai");
const anonymizePath = require("~/src/report/anon/anonymize-path");
const anonymizePathElement = require("~/src/report/anon/anonymize-path-element");

describe("report/anon/anonymizePath", () => {
  beforeEach(() => {
    anonymizePathElement.clearCache();
  });

  it("'' => ''", () => {
    expect(anonymizePath("")).to.equal("");
  });

  it("'////' => '////'", () => {
    expect(anonymizePath("////")).to.equal("////");
  });

  it("replaces with words from the word list", () => {
    expect(
      anonymizePath("src/tien/kleine/geitjes/index.ts", ["foo", "bar", "baz"])
    ).to.equal("src/foo/bar/baz/index.ts");
  });

  it("repeat calls with similar paths yield similar anon paths", () => {
    const WORDS = ["aap", "noot", "mies", "wim", "zus", "jet", "heide"];

    expect(anonymizePath("src/tien/kleine/geitjes/index.ts", WORDS)).to.equal(
      "src/aap/noot/mies/index.ts"
    );

    expect(anonymizePath("src/tien/kleine/geitjes/tien.ts", WORDS)).to.equal(
      "src/aap/noot/mies/aap.ts"
    );

    expect(anonymizePath("shwoop/tien/grote/geiten/index.ts", WORDS)).to.equal(
      "wim/aap/zus/jet/index.ts"
    );

    expect(
      anonymizePath("test/tien/kleine/geitjes/tien.spec.ts", WORDS)
    ).to.equal("test/aap/noot/mies/aap.spec.ts");
  });
});
