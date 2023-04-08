import { expect } from "chai";
import { anonymizePath } from "../../../src/report/anon/anonymize-path.mjs";
import { clearCache } from "../../../src/report/anon/anonymize-path-element.mjs";

describe("[U] report/anon/anonymizePath", () => {
  beforeEach(() => {
    clearCache();
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
    const lWords = ["aap", "noot", "mies", "wim", "zus", "jet", "heide"];

    expect(anonymizePath("src/tien/kleine/geitjes/index.ts", lWords)).to.equal(
      "src/aap/noot/mies/index.ts"
    );

    expect(anonymizePath("src/tien/kleine/geitjes/tien.ts", lWords)).to.equal(
      "src/aap/noot/mies/aap.ts"
    );

    expect(anonymizePath("shwoop/tien/grote/geiten/index.ts", lWords)).to.equal(
      "wim/aap/zus/jet/index.ts"
    );

    expect(
      anonymizePath("test/tien/kleine/geitjes/tien.spec.ts", lWords)
    ).to.equal("test/aap/noot/mies/aap.spec.ts");
  });
});
