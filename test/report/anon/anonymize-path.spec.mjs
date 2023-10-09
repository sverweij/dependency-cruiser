import { equal } from "node:assert/strict";
import { anonymizePath } from "#report/anon/anonymize-path.mjs";
import { clearCache } from "#report/anon/anonymize-path-element.mjs";

describe("[U] report/anon/anonymizePath", () => {
  beforeEach(() => {
    clearCache();
  });

  it("'' => ''", () => {
    equal(anonymizePath(""), "");
  });

  it("'////' => '////'", () => {
    equal(anonymizePath("////"), "////");
  });

  it("replaces with words from the word list", () => {
    equal(
      anonymizePath("src/tien/kleine/geitjes/index.ts", ["foo", "bar", "baz"]),
      "src/foo/bar/baz/index.ts",
    );
  });

  it("repeat calls with similar paths yield similar anon paths", () => {
    const lWords = ["aap", "noot", "mies", "wim", "zus", "jet", "heide"];

    equal(
      anonymizePath("src/tien/kleine/geitjes/index.ts", lWords),
      "src/aap/noot/mies/index.ts",
    );

    equal(
      anonymizePath("src/tien/kleine/geitjes/tien.ts", lWords),
      "src/aap/noot/mies/aap.ts",
    );

    equal(
      anonymizePath("shwoop/tien/grote/geiten/index.ts", lWords),
      "wim/aap/zus/jet/index.ts",
    );

    equal(
      anonymizePath("test/tien/kleine/geitjes/tien.spec.ts", lWords),
      "test/aap/noot/mies/aap.spec.ts",
    );
  });
});
